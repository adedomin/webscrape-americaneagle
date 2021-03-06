/*
 * Copyright (c) 2017, Anthony DeDominic <adedomin@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

var americanEagle = require('./lib/american-eagle'),
    nagiosOutput = require('./lib/nagios')

module.exports = function(credentials, nagios, pretty) {
    return americanEagle(credentials.username, credentials.password).then(accounts => {
        if (!nagios)
            console.log(JSON.stringify(accounts, null, pretty))
        else {
            var out = nagiosOutput(accounts, nagios)
            console.log(out.msg)
            process.exit(out.status)
        }
    }).catch(() => {
        if (!nagios) {
            console.log('[]')
        }
        else {
            console.log('Account Balances UNKN')
        }
        process.exit(3)
    })
}
