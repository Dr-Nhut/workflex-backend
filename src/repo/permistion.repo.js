class PermissionRepo {
    static async findPermission({ title }) {
        return await Permission.findOne({
            where: { title },
            include: [{ attributes: ['id', 'title'], model: Role, as: 'roles', through: { attributes: [] } }],
        });
    }
}