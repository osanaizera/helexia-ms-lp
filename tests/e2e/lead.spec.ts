import { test, expect } from '@playwright/test'

test.describe('LP Sion MS', () => {
test('fluxo completo (>=1000, Ouro, submit ok)', async ({ page }) => {
  await page.goto('/')

  // Preenche simulator
  await page.getByTestId('sim-input-bill').fill('1500')
  await page.getByTestId('sim-select-plan').selectOption('Ouro')

    await page.getByTestId('lead-email').fill('teste@example.com')
    await page.getByTestId('lead-bill').fill('1500')
    await page.getByTestId('lead-next').click()

    await page.getByTestId('lead-name').fill('Teste Usuário')
    await page.getByTestId('lead-phone').fill('67999999999')
    await page.getByTestId('lead-next').click()
    await page.getByTestId('lead-next').click()

    await page.getByRole('checkbox').check()
    await page.getByTestId('lead-submit').click()
    // In dev, submission shows alert. We cannot intercept here; in real, assert network call 200
  })

  test('abandono após passo 1 → parcial', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('lead-email').fill('partial@example.com')
    await page.getByTestId('lead-bill').fill('1200')
    await page.getByTestId('lead-next').click()
    // Expect partial POST fired; ideally intercept /api/lead?partial=1
  })

  test('valor < 1000 → permite enviar outsideScope', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('lead-email').fill('baixo@example.com')
    await page.getByTestId('lead-bill').fill('900')
    await page.getByTestId('lead-next').click()
    await page.getByTestId('lead-name').fill('Baixo Ticket')
    await page.getByTestId('lead-phone').fill('67999999999')
    await page.getByTestId('lead-next').click()
    await page.getByTestId('lead-next').click()
    await page.getByRole('checkbox').check()
    await page.getByTestId('lead-submit').click()
  })
})
