function reader(files) {
    var fr = new FileReader();
    fr.onload = async function (files) {
        try {
            wallet = JSON.parse(files.target.result);


            var content = "something text";
            var tx =
                await arweave.createTransaction(
                    {
                        data: content
                    },
                    wallet
                );

            await arweave.transactions.sign(tx, wallet)

            await arweave.transactions.post(tx)


        } catch (err) {
            alert('Error logging in: ' + err)
        }
    };
    fr.readAsText(files[0])
}