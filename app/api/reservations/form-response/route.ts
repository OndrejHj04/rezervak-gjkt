import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { data: { first_name, last_name, email, address, birth_date, id_code, form_id } } = await req.json()
  const [day, month, year] = birth_date.split(".")
  const formatBirthday = `${year}-${month}-${day}`

  const checkUser = await query({
    query: `SELECT id FROM users WHERE users.ID_code = ?`,
    values: [id_code]
  }) as any

  const [{ insertId: userInsertId }] = await Promise.all([
    !checkUser.length && query({
      query: `INSERT INTO users (first_name, last_name, role, email, verified, adress, birth_date, ID_code, active, theme) VALUES (?,?,4,?,1,?,?,?,1,1)`,
      values: [first_name, last_name, email, address, formatBirthday, id_code]
    })
  ]) as any

  const userId = userInsertId || checkUser[0].id

  const [{ affectedRows }] = await Promise.all([
    query({
      query: `INSERT IGNORE INTO users_reservations (userId, reservationId) SELECT ?, reservation_id FROM reservations_forms WHERE form_id = ?`,
      values: [userId, form_id]
    }),
  ]) as any

  if (affectedRows > 0) {
    const { insertId } = await query({
      query: `INSERT INTO reservations_users_change (user_id, reservation_id, direction, outside) SELECT ?, reservation_id, 1, 1 FROM reservations_forms WHERE form_id = ?`,
      values: [userId, form_id]
    }) as any

    query({
      query: `INSERT INTO reservations_users_change_users (user_id, change_id) VALUES (?,?)`,
      values: [userId, insertId]
    })
  }

  const userHasAccount = Boolean(checkUser.length)
  const isPartOfReservation = !Boolean(affectedRows)

  return NextResponse.json({ userHasAccount, isPartOfReservation }, { status: 201 })
}
