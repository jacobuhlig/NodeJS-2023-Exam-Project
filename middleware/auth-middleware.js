export function authorizationGuard(req, res, next) {
  console.log('Session:', req.session);
  if (!req.session) {
    return res.status(403).send({ message: "You are not authorized to see this page - General" });
  }
  next();
}

export function adminGuard(req, res, next) {
  if (req.session.role !== 'admin') {
    console.log(req.session.user.role);
    return res.status(403).send({ message: "You are not authorized to see this page - Admin" });
  }
  next();
}

export function adminAndCurrentUserGuard(req, res, next) {
  const { id } = req.params;
  console.log(id); 

  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  console.log(req.session.user.id); 
  console.log(req.session.user.role); 

  if (req.session.user.role !== 'admin' && req.session.user.id !== Number(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
  next();
}


export function validateUser(req, res, next) {
    const { username, email, password } = req.body;
    
    // Check if all necessary fields are present
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    // Add more checks if needed, like email format, password strength etc.

    next();
}
