const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');
const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');

const getLocation = (linkRef) => new Promise((resolve, reject) => {
    fetch('https://t.trip.com/FEr45bC', {
        method: 'GET',
        redirect: 'manual'
    })
        .then(res => {
            const headers = res.headers.raw()['location']
            resolve(headers[0])
        })
        .catch(e => reject(e))
});

const getSignLink = (signLink) => new Promise((resolve, reject) => {
    fetch(signLink, {
        method: 'GET'
    })
        .then(res => res.text())
        .then(res => resolve(res))
        .catch(e => reject(e))
});

const getCaptchaToken = () => new Promise((resolve, reject) => {
    const uuid = uuidv4();
    fetch('https://ic.trip.com/captcha/risk_inspect?callback=captcha08765646090613075&extend_param=2V6x7pDkvcrysIz84iab1m6XrMRAI%2F6VdNr1C7YFwPTYOT6WpeOkJ35%2FVOuaNd00BOhgbg5ibzEe8obCxvltfCGboKYcQSmJAOaLBFVSooo%3D&appid=100008493&business_site=ibu_registsdkmail_h5&version=1.0.3&dimensions=KIm6nh65KGrLNewiqQxrLAjW4OOXBMsFktPCI%2FYszWVAU37qucfEiFbmrVpRPuM4gb2mS4Qn%2FNKKdVZ33bFpmZ60UMhbb4sPEtsfD2gqSR6Lb93fev1stluEFyC%2FRSSP98FkhTg9eH%2FhMJnYkPWDIlIWFZCWp1lFIoEJCsNieAbfRdluHVsj3Via%2BtirGfY1N2ctUl6Wx8LF3acIvoRldMftiCC2H1SGwTRsncd25Kv2YmCQckwgjcwaRCVSuY97iuZ2RooaYZKvMC0cUFftK5wOJgQFfNniaYB0VWlseDdqW4LoqJjt4hxFUE7%2BAvhV7S1jmJdTiN2sxPe0jZ5CAVL0wttjGfNC27GKvrFYCMegainPGuPscM%2FTnbYvdXUEAmqApj5l0%2BIW787hIYO2Ygz%2F%2FgsN%2FF56v4QxgpSgrIN3VwD1wsfuyrDMPdMkapaXNdFjBe%2FB2rDBSile4ZVVYwzW6DWJ2kIqfSL7hW2c1AlhKlez1KkKGUKNiEEpcwPNbGRU5TAReBgmP4RAWob8%2F9SeQRZO%2Bgsq0hSLSk3586YbU1%2BRm3Bsjmh4FnB8zXQc9LBrCCyAQDujHRviw%2B6Dl3HB2rg6JY1ofZCZg%2B%2Bd7qfOPSFSNo0%2FHAfZmm6tuCSe%2ByjOiS9FCeSvw69rjwkYiLyd0Z127D0fqrQ0g6TGIYEmHpih%2FJgfPbi90l%2BpgT0ZfMSsg5lYuIgtKrqTAxPU1FlKbE5k0Nxx9z6O1F19Ob593pRHyNuyXgUAeC%2FxxNOvDelAoy%2B5ZmMUNOeUWH74lfHtGLSQBTx5VtUbiwjjPDRVXhWpc6AIprOdy3Z5JoGEYpFcOuBuIFn3%2BLRzNCuhjqtv7Y7EojYKXtqAssKJimndKRLi92GMGZyToHlBfM%2F4URhpMeo7sQs5OxJba%2Flu0cxbylTa3VEAqEaLIdvtgfCNhgqFav6w4up0KZAq2eQdaXpRG%2BbJVq7wzn060tmhua9x1HIv3w4onsJEACy3b26VjNpqMdy2meC2oHEdjg268RsPAu3NLiasV8XqNDWkJuQb30xowV34tdQJ3L5XaV4G%2Bn5So%2BmrgZGn829Tw8gFnof4D0%2BrpD1Ebu%2BY8y7n%2BzCoY6Fx9DJisEcZfzJg63zQ3r0Mrwr99Fw%2B99D9iGoX3I6Adrgs%2FnEfhQA6HzGEEA%3D%3D&sign=082be44acaf7273d4483b46b56a6b7e6', {
        headers: {
            'authority': 'ic.trip.com',
            'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
            'accept': '*/*',
            'sec-fetch-site': 'same-site',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'script',
            'referer': 'https://id.trip.com/',
            'accept-language': 'id-ID,id;q=0.9',
            // 'cookie': '_bfa=1.1627944900193.1lr5m46.1.1627944900193.1627944900841.1.1.10650059233; _RF1=36.73.32.148; _RSG=gvaHbY.iBRD2KtfGk1EupB; _RDG=28b98b063d5183244f2c84d8ac8940bb25; _RGUID=d6cbb3e8-a546-4e6a-bcf8-381b90a77502'
        }
    })
        .then(res => res.text())
        .then(res => resolve(res))
        .catch(e => reject(e))
});

const register = (referenceCode, email) => new Promise((resolve, reject) => {
    const uuid = uuidv4();
    fetch('https://www.trip.com/gateway/api/soa2/12559/noVerifyedEmailRegisterAndLogin', {
        method: 'POST',
        headers: {
            'authority': 'www.trip.com',
            'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
            'accept': 'application/json, text/plain, */*',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
            'content-type': 'application/json; charset=UTF-8',
            'origin': 'https://id.trip.com',
            'sec-fetch-site': 'same-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://id.trip.com/',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            // 'cookie': `_abtest_userid=${uuid}; cookiePricesDisplayed=IDR; _gid=GA1.2.2143619870.1627936749; ibu_webpush_scope=%252F; _gcl_au=1.1.394333225.1627936750; _RF1=36.73.32.148; _RSG=UHKmqtr1j40C.wkMQDQzF9; _RDG=286e6db28800042e7b038188618f5c61ab; _RGUID=012d075d-f4c1-445e-93fd-68d696bbaf8c; nfes_isSupportWebP=1; Union=AllianceID=1078328&SID=2036522&OUID=ctag.hash.3d0e0be46f89&Expires=1630528992520&createtime=1627936992; ibu_online_home_language_match={"isFromTWNotZh":false,"isFromIPRedirect":false,"isFromLastVisited":true,"isRedirect":false,"isShowSuggestion":false,"lastVisited":"https://id.trip.com?locale=id-id"}; _lizard_LZ=7AVSGNBbkngaofpeOUtDRC6lyT8LK4I9uY0Ez3ZQw+hcdMr-P1H5xXiJFvWsjqm2; ibu_h5_site=EN; ibu_h5_group=trip; ibu_h5_local=en-xx; ibu_h5_lang=enxx; ibu_h5_curr=IDR; IBU_TRANCE_LOG_URL=%2Fhotelsevent%2Finvited%3FreferenceCode%3DVFJJUDcwejlFdnU0NUprTFFCMmRPL2h2am5uY2ZHcFl3WHNmcGNzeTZoTVcwdGM9; ibu_h5_home_language_match={"isFromTWNotZh":false,"isFromIPRedirect":false,"isFromLastVisited":true,"isRedirect":false,"isShowSuggestion":false,"lastVisited":"https://id.trip.com?locale=id-id"}; librauuid=pbXQuT9kNgnU2Bkd; IBU_TRANCE_LOG_P=67261658756; _bfi=p1%3D0%26p2%3D0%26v1%3D49%26v2%3D44; ibulanguage=ID; ibulocale=id_id; _gat=1; _dc_gtm_UA-109672825-11=1; _gat_UA-109672825-3=1; _bfs=1.2; _ga_X437DZ73MR=GS1.1.1627942473.2.1.1627942477.0; _ga=GA1.1.1565354441.1627936749; _bfa=1.1627936749217.oqsqf.1.1627939770253.1627942479652.2.52.10650059233`,
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            "AccountHead": {
                "Token": "p03dc618112f61257de1ec0b14c66b832e12bef8f0e09",
                "SliderVersion": "1.0.3",
                "Platform": "H5",
                "Locale": "id-id"
            },
            "Data": {
                "email": email,
                "password": "XnXX321Crazy",
                "context": {
                    "Platform": "H5",
                    "rmsToken": "fp=1xinlog-1vut8qk-mxnas1&vid=1627936749217.oqsqf&pageId=10650059233&r=012d075df4c1445e93fd68d696bbaf8c&ip=36.73.32.148&rg=fin&screen=1440x900&tz=+7&blang=id-ID&oslang=id-ID&ua=Mozilla%2F5.0%20(Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F92.0.4515.107%20Safari%2F537.36&v=m15&bl=false&clientid=",
                    "vid": "1627936749217.1",
                    "locale": "id-id",
                    "group": "trip",
                    "http_referer": "",
                    "http_cookie": `_abtest_userid=${uuid}; cookiePricesDisplayed=IDR; _tp_search_latest_channel_name=hotels; _gid=GA1.2.2143619870.1627936749; ibu_webpush_scope=%252F; _gcl_au=1.1.394333225.1627936750; ibu_h5_site=ID; ibu_h5_group=trip; ibu_h5_local=id-id; ibu_h5_lang=idid; ibu_h5_curr=IDR; IBU_TRANCE_LOG_URL=%2Fhotelsevent%2Finvited%3FreferenceCode%3D${referenceCode}; _RF1=36.73.32.148; _RSG=UHKmqtr1j40C.wkMQDQzF9; _RDG=286e6db28800042e7b038188618f5c61ab; _RGUID=012d075d-f4c1-445e-93fd-68d696bbaf8c; GUID=09031097316217946620; nfes_isSupportWebP=1; nfes_isSupportWebP=1; __utma=1.1565354441.1627936749.1627936886.1627936886.1; __utmc=1; __utmz=1.1627936886.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); Union=AllianceID=1078328&SID=2036522&OUID=ctag.hash.3d0e0be46f89&Expires=1630528992520&createtime=1627936992; ibu_online_home_language_match={\"isFromTWNotZh\":false,\"isFromIPRedirect\":false,\"isFromLastVisited\":true,\"isRedirect\":false,\"isShowSuggestion\":false,\"lastVisited\":\"https://id.trip.com?locale=id-id\"}; ibu_install_pop_closed=hide; ibu-h5-pop-hotel=0; _lizard_LZ=7AVSGNBbkngaofpeOUtDRC6lyT8LK4I9uY0Ez3ZQw+hcdMr-P1H5xXiJFvWsjqm2; ibu_h5_home_language_match={\"isFromTWNotZh\":false,\"isFromIPRedirect\":false,\"isFromLastVisited\":true,\"isRedirect\":false,\"isShowSuggestion\":false,\"lastVisited\":\"https://id.trip.com?locale=id-id\"}; _pd=%7B%22r%22%3A16%2C%22d%22%3A19%2C%22_d%22%3A3%2C%22p%22%3A67%2C%22_p%22%3A48%2C%22o%22%3A73%2C%22_o%22%3A6%2C%22s%22%3A74%2C%22_s%22%3A1%7D; _ga=GA1.3.1565354441.1627936749; _gid=GA1.3.2143619870.1627936749; IBU_showtotalamt=0; librauuid=pbXQuT9kNgnU2Bkd; _bfi=p1%3D0%26p2%3D0%26v1%3D49%26v2%3D44; ibulanguage=ID; ibulocale=id_id; _gat=1; _dc_gtm_UA-109672825-11=1; _gat_UA-109672825-3=1; _bfs=1.2; _ga_X437DZ73MR=GS1.1.1627942473.2.1.1627942477.0; _ga=GA1.1.1565354441.1627936749; IBU_TRANCE_LOG_P=25754286286; _bfa=1.1627936749217.oqsqf.1.1627939770253.1627942479652.2.52.10650059233", "Url": "https://id.trip.com/hotelsevent/invited?referenceCode=${referenceCode}`,
                    "UserAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
                    "referCode": ""
                },
                "accountHead": {
                    "accessCode": "32A1EC5605A0E395",
                    "locale": "id-id",
                    "platform": "H5",
                    "group": "trip",
                    "rmsToken": "fp=1xinlog-1vut8qk-mxnas1&vid=1627936749217.oqsqf&pageId=10650059233&r=012d075df4c1445e93fd68d696bbaf8c&ip=36.73.32.148&rg=fin&screen=1440x900&tz=+7&blang=id-ID&oslang=id-ID&ua=Mozilla%2F5.0%20(Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F92.0.4515.107%20Safari%2F537.36&v=m15&bl=false&clientid=",
                    "sourceId": "66000100"
                }
            }
        })
    })
        .then(res => res.text())
        .then(res => resolve(res))
        .catch(e => reject(e))
});

const genUniqueId = length =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible =
            "abcdefghijklmnopqrstuvwxyz1234567890";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        resolve(text);
    });


const ssoCrossI18NSetCookie = (ticket) => new Promise((resolve, reject) => {
    fetch('https://www.trip.com/ssoproxy/ssoCrossI18NSetCookie', {
        method: 'POST',
        headers: {
            'authority': 'www.trip.com',
            'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
            'accept': 'application/json, text/plain, */*',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded',
            'origin': 'https://id.trip.com',
            'sec-fetch-site': 'same-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://id.trip.com/',
            'accept-language': 'id-ID,id;q=0.9',
            // 'cookie': '_bfa=1.1627944900193.1lr5m46.1.1627944900193.1627944900841.1.1.10650059233; _RF1=36.73.32.148; _RSG=gvaHbY.iBRD2KtfGk1EupB; _RDG=28b98b063d5183244f2c84d8ac8940bb25; _RGUID=d6cbb3e8-a546-4e6a-bcf8-381b90a77502'
        },
        body: `domain=trip.com&ticket=${ticket}&Secretkey=A8CC960CD9BD65C74E3080DAA89B0623`
    })
        .then(res => res.json())
        .then(res => resolve(res))
        .catch(e => reject(e))
});

(async () => {

    const reffMu = readlineSync.question('Masukan refmu : ');
    
    try {
        const email = `aminGanteng${await genUniqueId(5)}@ifrghee.com`;
        console.log(`mencoba email => ${email} didaftarkan untuk reff ${reffMu}`)
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                "--start-maximized",
                "--disable-popup-blocking",
                "--allow-popups-during-page-unload"
            ]
        });

        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', request => request.continue())
        page.on('response', async response => {
            // console.log(response.request().resourceType())
            if (response.request().url().includes('noVerifyedEmailRegisterAndLogin')) {
                if (await (await response.text()).includes('{')) {
                    const result = JSON.parse((await response.json()).Result);
                    if (result.ticket) {
                        const ssoCrossI18NSetCookieResult = await ssoCrossI18NSetCookie(result.ticket);
                        console.log(`email => ${email} berhasil didaftarkan untuk reff ${reffMu}`)

                        console.log(ssoCrossI18NSetCookieResult)
                        console.log("")

                        await browser.close();
                    }
                }
            }
        })
        // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');


        const locationRef = await getLocation(reffMu);
        await page.goto(locationRef);

        //claim click
        await page.waitForSelector('.invitee-info_btn');
        await page.click('.invitee-info_btn')

        //input register
        await page.waitForSelector('#registerContent > div:nth-child(2) > div > div.text-field__main___141SM > div.text-field__inputWrap___1CQw5 > input');
        await page.waitForSelector('#registerContent > div:nth-child(3) > div > div.text-field__main___141SM > div.text-field__inputWrap___1CQw5 > input');
        await page.focus('#registerContent > div:nth-child(2) > div > div.text-field__main___141SM > div.text-field__inputWrap___1CQw5 > input')
        await page.keyboard.type(email)
        await page.focus('#registerContent > div:nth-child(3) > div > div.text-field__main___141SM > div.text-field__inputWrap___1CQw5 > input')
        await page.keyboard.type('XnXX321Crazy')

        let error;
        let errorValueRegister = ''

        do {
            try {
                //register 
                await page.waitForSelector('#registerContent > div.accounts__registerBtn___350up > div');
                await page.click('#registerContent > div.accounts__registerBtn___350up > div');

                await page.waitForSelector(".cpt-drop-btn", { visibe: true, timeout: 5000 });
                const sliderHandler = await page.$('.cpt-drop-btn');
                const handler = await sliderHandler.boundingBox();

                let currentPosition = 0;

                await page.mouse.move(handler.x, handler.y);
                await page.mouse.down();

                const valueData = 2000


                for (let index = 0; index < valueData; index++) {
                    await page.mouse.move(handler.x + currentPosition, handler.y);
                    currentPosition += 10
                }

                await page.mouse.move(handler.x + currentPosition, handler.y, { stpes: 50 });
                await page.mouse.up();

                let element = await page.$('#register-error-tip > div > span');
                let value = await page.evaluate(el => el.textContent, element);
                errorValueRegister = value;

                // let successElement = await page.$('#layOut > div.accounts__registerFinish___1YwjC > div.accounts__registerFinishHead___1fLG2 > div.accounts__headCongratulation___1abov');
                // let valueSuccessElement = await page.evaluate(el => el.textContent, successElement);
                // console.log(valueSuccessElement)

                error = false;
                break;
            } catch (e) {
                error = true;
            }
        } while (error);




        // console.log("di end", dataCaptchaToken)

        // const refCode = locationRef.split('=')[1]
        // const captchaToken = await getCaptchaToken();
        // const captchaTokenResult = JSON.parse(captchaToken.split('captcha08765646090613075(')[1].split(')')[0]);
        // const registerResult = await register(refCode, 'amin5@ifrghee.com')
        // console.log(registerResult)
    } catch (e) {
        console.log(e)
    }

})();