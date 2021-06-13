const Role = require("../models/role.model");
/**
 * Auto-generate roles after successfully connected to db
 */
exports.roleInitialize = async () => {
    try {
        //add item to this array will also add new role document to database
        var roles = ["admin", "staff", "trainer", "trainee"]; //delete items from this array will remove the role from database
        for (var x of roles) {
            var check_name = await Role.find({ name: x });
            if (check_name.length == 0) await Role.create({ name: x }, (err) => {
                if (!err) console.log("Added role '" + x + "' to database.");
            });
            let role_db = await Role.find({});
            var role_names = [];
            for (var i of role_db) role_names.push(i.name);
            var alien_roles = role_names.filter(x => !roles.includes(x));
            for (var j of alien_roles) {
                await Role.deleteOne({ name: j });
                console.log("Deleted alien role '" + j + "'");
            }
        }
    } catch (e) {
        console.log(e)
    }
}