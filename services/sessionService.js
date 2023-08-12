export const createSession = (req, { id, role, email, username }) => {
  req.session.user = {
    id: id,
    role: role,
    email: email,
    username: username,
  };
};

export const destroySession = req => {
  return new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
