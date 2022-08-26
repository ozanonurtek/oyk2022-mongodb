// Here we are passing args to function as (a,b)

[{
    $project: {
        name: 1,
        total_money_raised: 1,
        currency: {
            $function: {
                lang: 'js',
                args: [
                    '$total_money_raised',
                    '$name'
                ],
                body: 'function(a, b){return a + "-" + b;}'
            }
        }
    }
}]