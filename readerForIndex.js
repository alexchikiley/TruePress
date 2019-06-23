
walletObject = '6BPbad7cWVL5IHhKQU0AB8w9OxbolNnuLDjDDy8UY10';
var oursIdArray = [];
var dataChanged;

refresh_inbox(walletObject);

function refresh_inbox(wallet) {
    (async () => {
        var address = '6BPbad7cWVL5IHhKQU0AB8w9OxbolNnuLDjDDy8UY10';

        let get_mail_query =
            {
                op: 'equals',
                expr1: 'from',
                expr2: address

            };

        const res = await this.arweave.api.post(`arql`, get_mail_query);

        var tx_rows = [];

        if (res.data == '') {
            tx_rows = []
        } else {
            tx_rows = await Promise.all(res.data.map(async function (id, i) {
                let tx_row = {}
                var tx = await this.arweave.transactions.get(id)
                tx_row['unixTime'] = '0'
                tx.get('tags').forEach(tag => {
                    let key = tag.get('name', {decode: true, string: true})
                    let value = tag.get('value', {decode: true, string: true})
                    if (key === 'Unix-Time') tx_row['unixTime'] = value
                })

                tx_row['id'] = id;

                return tx_row
            }))
        }

        tx_rows.sort((a, b) => (Number(b.unixTime) - Number(a.unixTime)))


        let arrayOfId = [];
        for (let i = 0; tx_rows.length > i; i++) {
            arrayOfId.push(tx_rows[i].id);
        }
        initArrayOfId(arrayOfId);
        oursIdArray = arrayOfId;



        let transactionsArray = new Map();


        let r = 0;
        arrayOfId.forEach(function (element, index) {

            const transaction = arweave.transactions.get(element).then(transaction => {
                let tempData = transaction.get('data', {decode: true, string: true});
                transactionsArray.set(element, tempData);
                if(transactionsArray.size == arrayOfId.length){
                    dataChanged = transactionsArray;
                    takeTextInArticle(transactionsArray);

                }
            });
        });
    })()
}


function takeTextInArticle(arrayOfArticle) {
    let documentToEnterText = document.getElementById('container-of-article');
    documentToEnterText.innerText = arrayOfArticle.get('IFfAFq7VDCA2E6iS1lH1Mk_rlr4UnyMSHOD6iyKpYeM');
}

function initArrayOfId (arrayHasIdHash) {
    let sideBarParrent = document.getElementById('sidebar-parent');
    for(let z = arrayHasIdHash.length-1; arrayHasIdHash.length-4 < z; z--) {
        let newDiv = document.createElement('div');
        sideBarParrent.appendChild(newDiv).className = "container-sidebar-tab";

        switch (z) {
            case arrayHasIdHash.length-2:
                newDiv.innerText = "The medical student who died of measles";
                newDiv.setAttribute('hashId', arrayHasIdHash[z]);
                newDiv.setAttribute('onclick', 'checkHashAndWrite(\''+arrayHasIdHash[z]+'\')');
                break;
            case arrayHasIdHash.length-3:
                newDiv.innerText = "\'Excellent\' letter from Trump";
                newDiv.setAttribute('hashId', arrayHasIdHash[z]);
                newDiv.setAttribute('onclick', 'checkHashAndWrite(\''+arrayHasIdHash[z]+'\')');
                break;
            default:
                newDiv.innerText = "Will Gompertz reviews George Clooney\'s Channel 4 drama";
                newDiv.setAttribute('hashId', arrayHasIdHash[z]);
                newDiv.setAttribute('onclick', 'checkHashAndWrite(\''+arrayHasIdHash[z]+'\')');
                break;
        }
    }
}


function checkHashAndWrite(hash) {
    let changeContent = document.getElementById('container-of-article');
    changeContent.innerHTML = dataChanged.get(hash);
}
