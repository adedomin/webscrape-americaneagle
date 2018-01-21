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

var puppeteer = require('puppeteer')

module.exports = async function run(username, password) {
    var accounts
    var browser
    try { 
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        })
        var page = await browser.newPage()

        page.on('error', (err) => console.log(err))

        await page.goto('https://americaneagle.org')
        if (!await page.evaluate((user) => {
            document.getElementById('LoginName').value = user
            return window.SubmitForm()
        }, username)) { 
            throw 'unknown error'
        }

        await page.waitForNavigation()
        await page.evaluate((password) => {
            document.querySelector(
                '.input_box.full_width'
            ).value = password
            return document.querySelectorAll(
                'input[type="submit"]'
            )[2].click()
        }, password)

        await page.waitForNavigation()
        accounts = await page.evaluate(() => {
            var accounts = []
            // first from this q is bogus
            Array.prototype.slice.call(
                document.querySelectorAll('tr'), 2
            ).forEach(row => {
                var arr = []
                var nodes = row.childNodes
                for (var i=0; i<nodes.length; i++) {
                    if (!nodes[i]) continue
                    else if (!nodes[i].innerHTML) continue
                    else if (nodes[i].innerHTML.indexOf('<') == 0) continue
                    else if (nodes[i].innerHTML == '&nbsp;') continue
                    arr.push(nodes[i].innerHTML)
                }
                if (!arr[1]) return
                if (arr[2]) arr[2] = +arr[2].replace(/[,$]/g, '')
                if (arr[3]) arr[3] = +arr[3].replace(/[,$]/g, '')
                accounts.push({
                    id: arr[1],
                    type: arr[0],
                    balance: arr[2],
                    avail: arr[3],
                })
            })
            return accounts
        })
    }
    catch (e) {
        accounts = []
    }
    finally {
        browser.close()
    }
    return accounts
}
