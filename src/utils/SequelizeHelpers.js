
class SequelizeHelpers {
    static async upsert(model, searchFields, updateFields) {
        try {
            const record = await model.findOne({ where: searchFields });

            if (!record) {
                return await model.create({ ...searchFields, ...updateFields });
            }

            return await record.update(updateFields);
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = SequelizeHelpers