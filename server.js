const roleInitialize = async () => {
    try {
        const count = await Role.estimatedDocumentCount();
        if (count === 0) {
            await Role.create({name: "admin"});
            console.log("Roles admin is added.")

            await Role.create({name: "staff"});
            console.log("Roles staff is added.")

            await Role.create({name: "trainer"});
            console.log("Roles trainer is added.")

            await Role.create({name: "trainee"});
            console.log("Roles trainee is added.")

        }
    } catch (e) {
        console.log(e)
    }
}