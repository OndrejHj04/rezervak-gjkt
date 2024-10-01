type userObjectType = any

export const getFullName = (userObject: userObjectType) => {
  const { first_name, last_name } = userObject
  return `${first_name} ${last_name}`
}

