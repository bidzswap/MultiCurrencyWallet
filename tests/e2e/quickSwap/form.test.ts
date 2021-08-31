import puppeteer from 'puppeteer'
import { createBrowser, importWallet, timeOut, takeScreenshot } from '../utils'

// TODO: use encrypted secrets
const mainnetEvmWallet = {
  seed: [],
  address: '0xb7d9F97Fe2c396906957634CA5bcE87Ff4a8a119',
}

jest.setTimeout(80_000) // ms

describe('Quick swap interface tests', () => {
  const waitingForStartup = 150_000
  let browser: undefined | puppeteer.Browser = undefined
  let page: undefined | puppeteer.Page = undefined

  beforeAll(async () => {
    const { browser: newBrowserInstance, page: newPageInstance } = await createBrowser()

    browser = newBrowserInstance
    page = newPageInstance

    await importWallet({
      page,
      seed: mainnetEvmWallet.seed,
    })
  }, waitingForStartup)

  afterAll(async () => {
    if (page) {
      await page.close()
    }

    if (browser) {
      await browser.close()
    }
  })

  it('Restored wallet is fine', async () => {
    if (browser && page) {
      try {
        await page.waitForSelector('#ethAddress')

        const recoveredEthAddress = await page.$eval('#ethAddress', (el) => el.textContent)

        expect(recoveredEthAddress).toBe(mainnetEvmWallet.address)
      } catch (error) {
        await takeScreenshot(page, 'RestoreWalletTestError')
        await browser.close()
        console.error('Restore wallet test error: ', error)
        expect(false).toBe(true)
      }
    } else {
      throw new Error('No the browser or the page')
    }
  })

  it('the correct API response with the swap data', async () => {
    if (browser && page) {
      try {
        //
      } catch (error) {
        console.error('API response error: ', error)
        await takeScreenshot(page, 'APIResponseError')
        expect(false).toBe(true)
      }
    } else {
      throw new Error('No the browser or the page')
    }
  })
})
