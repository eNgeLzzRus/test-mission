const checkUserAccess = (req, res, next) => {
    const requestedUserId = parseInt(req.params.id, 10);
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    if (currentUserRole === 'admin' || currentUserId === requestedUserId) {
        return next();
    }

    return res.status(403).json({ error: 'Access denied' });
}

module.exports = { checkUserAccess };