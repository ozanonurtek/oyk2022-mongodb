/*SAMPLE DATA

{
    "_id": {
        "$oid": "63037c1e20237a52933c09ba"
    },
    "kurs_adi": "mongodb",
        "egitmenler": [
            "X y",
            "Z t",
            "V k"
        ],
            "kontenjan": 16,
                "kategori": "Veritabani",
                    "yer": "Bolu"

                }
*/

//////////////////////////////////////////////
////////////////////////////////AGGREGATION 1
//////////////////////////////////////////////

db.kurslar.aggregate([
    {
        $project: {
            _id: 1,
            kurs_adi: 1,
            egitmenler: 1
        }
    },
    {
        $project: {
            kurs_adi: 1,
            egitmen_sayisi: {
                $size: '$egitmenler'
            },
            egitmen1: {
                $arrayElemAt: [
                    '$egitmenler',
                    0
                ]
            }
        }
    }
])