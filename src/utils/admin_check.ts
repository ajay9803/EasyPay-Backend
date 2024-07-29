/**
 * Checks if the user is an admin based on the role ID.
 *
 * @param {string} roleId - The role ID of the user.
 * @return {boolean} Returns true if the user is an admin, false otherwise.
 */
export const adminCheck: (roleId: string) => boolean = (roleId: string) => {
  if (roleId === "1") {
    return true;
  } else {
    return false;
  }
};
