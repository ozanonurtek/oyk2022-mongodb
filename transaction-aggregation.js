/* SAMPLE DATA
{
    "_id": {
      "$oid": "62fc1e05928d98905a15dc60"
    },
    "block": {
      "chain": null,
      "block_number": null,
      "base_fee_per_gas": {
        "$numberDecimal": "0"
      },
      "difficulty": {
        "$numberDecimal": "7545144155700"
      },
      "gas_limit": {
        "$numberDecimal": "3141592"
      },
      "gas_used": {
        "$numberDecimal": "168811"
      },
      "size": 1276,
      "timestamp": {
        "$date": {
          "$numberLong": "1446833741000"
        }
      },
      "total_difficulty": {
        "$numberDecimal": "2694305773793258830"
      },
      "transactions_root": "0x99a3262a35534f894c5d23dd7240e1d0f6e1ddf974036c885bc8b4da26b5babb",
      "state_root": "0xf2e53203a7b401444cb5a59810241b7cbaf0c29120cd1fcc058e84c1710ff9f1",
      "sha3_uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "receipts_root": "0xcc33f6d7b329ebf6e2a145e76c94a68b06c053c4ecf236d7c0b8aa5ad63cd00f",
      "parent_hash": "0xb3d752ab6acf65d77e1cd098ce0dd7d49bde45af55ec2e8268cd3a71e61958df",
      "nonce": "0xdd44abb48ef22dfa",
      "mix_hash": "0x9fdf687275e4d7d54e31396e5fa9b82241f36483f9fa55420b705cdf1644e82e",
      "miner": "0x580992B51e3925e23280EfB93d3047C82f17E038",
      "logs_bloom": "0x00000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000200000000200000000000000000000000000000000000000000000000000000000000000000000000000008000000000100000000000000000000000000000000000000000004000000000000000000000000000000080000000000000000000000001000000000000000000004000000000000000000000001000000000000001000000400000000000000000000000000000000000000000000000040000000000000000000000000040000000000000000400000001000000000000000000000040000000400000000000000000",
      "hash": "0x1af2b70fe090d8e36eb97cb5d771508e5a992be3c68a67b234e737392296bb1e",
      "extra_data": "0xd783010203844765746887676f312e352e31856c696e7578"
    },
    "from_address": "0x63a9975ba31B0b9626b34300f7f627147dF1F526",
    "to_address": "0x62F54f063BE7C373C99B19faf9172384765a36f9",
    "gas": {
      "$numberDecimal": "90000"
    },
    "gas_price": {
      "$numberDecimal": "50000000000"
    },
    "nonce": 22932,
    "transaction_index": 0,
    "value": {
      "$numberDecimal": "41857980000000000"
    },
    "transaction_type": null,
    "block_number": 500050,
    "block_hash": "0x1af2b70fe090d8e36eb97cb5d771508e5a992be3c68a67b234e737392296bb1e",
    "input": "0x",
    "hash": "0x6120f55fb627a52a9e64dd26d3a67a469256cbf08ce852320651a056eed7215a",
    "chain_id": null,
    "time_stamp": {
      "$date": {
        "$numberLong": "1446833741000"
      }
    },
    "v": 28,
    "r": "0x7ad3f5e03533a355cea085ff1be7f36afe3b7b85c269239347cd8a43e01317d2",
    "s": "0x7534cb9389d75127d31424da191c5ca0461081e647b1c2e8485ef07db0900016",
    "logs": [],
    "logs_bloom": null,
    "status": null,
    "effective_gas_price": null,
    "type_data": "0x0",
    "function": null,
    "function_raw": null,
    "function_params": null,
    "token": null
  }

*/

//////////////////////////////////////////////
////////////////////////////////AGGREGATION 1
//////////////////////////////////////////////
[{
    $group: {
        _id: '$from_address',
        count: {
            $sum: 1
        },
        total_value: {
            $sum: '$value'
        }
    }
}, {
    $project: {
        real_value: {
            $divide: [
                '$total_value',
                {
                    $pow: [
                        10,
                        18
                    ]
                }
            ]
        },
        _id: 0,
        value: 1,
        address: '$_id',
        count: 1
    }
}]

////////////////////////////////////////
/////////////////////////AGGREGEATION 2
////////////////////////////////////////

[{
    $group: {
        _id: {
            from_address: '$from_address',
            month: {
                $month: '$time_stamp'
            },
            year: {
                $year: '$time_stamp'
            }
        },
        count: {
            $sum: 1
        },
        total_value: {
            $sum: '$value'
        }
    }
}, {
        $project: {
            real_value: {
                $divide: [
                    '$total_value',
                    {
                        $pow: [
                            10,
                            18
                        ]
                    }
                ]
            },
            _id: 0,
            total_value: 1,
            address: '$_id.from_address',
            count: 1,
            year: '$_id.year',
            month: '$_id.month'
        }
    }]


////////////////////////////////////////
/////////////////////////AGGREGEATION 3
////////////////////////////////////////

[{
    $lookup: {
        from: 'token',
        localField: 'to_address',
        foreignField: 'address',
        as: 'new_token'
    }
}, {
    $match: {
        'new_token.address': {
            $exists: true
        }
    }
}, {
    $group: {
        _id: {
            from_address: '$from_address',
            month: {
                $month: '$time_stamp'
            },
            year: {
                $year: '$time_stamp'
            }
        },
        count: {
            $sum: 1
        },
        total_value: {
            $sum: '$value'
        }
    }
}, {
    $project: {
        real_value: {
            $divide: [
                '$total_value',
                {
                    $pow: [
                        10,
                        18
                    ]
                }
            ]
        },
        _id: 0,
        total_value: 1,
        address: '$_id.from_address',
        count: 1,
        year: '$_id.year',
        month: '$_id.month'
    }
}, {
        $limit: 10
    }]