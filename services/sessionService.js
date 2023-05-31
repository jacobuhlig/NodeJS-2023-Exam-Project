export const createSession = (req, { id, role }) => {
  req.session.user = id;
  req.session.role = role;
};

export const destroySession = (req) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
