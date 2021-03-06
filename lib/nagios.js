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

var NagiosExits = {
    OK: 0,
    WARN: 1,
    CRIT: 2,
    UNKN: 3,
}

// account nums might be numeric
function perfdata(account) {
    return `${account.id}=${account.avail}`
}

// doesn't support warning/critical status yet
module.exports = function(accounts, config) {
    if (!accounts || accounts.length < 1) {
        return { status: NagiosExits.CRIT, msg: 'Account Balances CRIT'}
    }
    return { status: NagiosExits.OK, msg: `\
Account Balances OK | ${accounts.map(account => perfdata(account)).join(' ')}`}
}
