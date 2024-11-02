import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { data: { first_name, last_name, email, address, birth_date, id_code, form_id } } = await req.json()
  const [day, month, year] = birth_date.split(".")
  const formatBirthday = `${year}-${month}-${day}`

  const invalidRequest = await query({
    query: `SELECT * FROM users u WHERE u.email = ? AND u.ID_code <> ?`,
    values: [email, id_code]
  }) as any

  if (invalidRequest.length) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const checkUser = await query({
    query: `SELECT id FROM users WHERE users.ID_code = ?`,
    values: [id_code, email]
  }) as any

  const [{ insertId: userInsertId }] = await Promise.all([
    !checkUser.length && query({
      query: `INSERT INTO users (first_name, last_name, role, email, verified, adress, birth_date, ID_code, theme) VALUES (?,?,4,?,0,?,?,?,1)`,
      values: [first_name, last_name, email, address, formatBirthday, id_code]
    })
  ]) as any

  const userId = userInsertId || checkUser[0].id

  const { affectedRows } = await query({
    query: `INSERT IGNORE INTO users_reservations (userId, reservationId, verified, outside) SELECT ?, reservation_id, 0, 1 FROM reservations_forms WHERE form_id = ?`,
    values: [userId, form_id]
  }) as any

  const userHasAccount = Boolean(checkUser.length)
  const isPartOfReservation = !Boolean(affectedRows)

  return NextResponse.json({ userHasAccount, isPartOfReservation }, { status: 201 })
}
