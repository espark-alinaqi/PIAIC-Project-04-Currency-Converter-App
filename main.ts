import axios from 'axios';
import inquirer from 'inquirer';

async function getExchangeRates(baseCurrency: string): Promise<{ rates: Record<string, number> }> {
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;
    const response = await axios.get(apiUrl);
    return response.data;
}

export async function startCurrencyConverterApp() {
    console.log('Welcome to the Currency Converter App!');

    const { baseCurrency } = await inquirer.prompt({
        type: 'input',
        name: 'baseCurrency',
        message: 'Enter the base currency code (e.g., USD):'
    });

    while (true) {
        const { targetCurrency, amount } = await inquirer.prompt([
            {
                type: 'input',
                name: 'targetCurrency',
                message: 'Enter the target currency code (e.g., EUR):'
            },
            {
                type: 'input',
                name: 'amount',
                message: 'Enter the amount to convert:'
            }
        ]);

        const exchangeRates = await getExchangeRates(baseCurrency);

        if (exchangeRates.rates[targetCurrency]) {
            const convertedAmount = parseFloat(amount) * exchangeRates.rates[targetCurrency];
            console.log(`${amount} ${baseCurrency} is approximately ${convertedAmount.toFixed(2)} ${targetCurrency}\n`);
        } else {
            console.log(`Currency code ${targetCurrency} not found in exchange rates. Please try again.\n`);
        }

        const { continueConversion } = await inquirer.prompt({
            type: 'confirm',
            name: 'continueConversion',
            message: 'Do you want to perform another conversion?',
            default: true
        });

        if (!continueConversion) {
            console.log('Thank you for using the Currency Converter App. Goodbye!');
            process.exit(0);
        }
    }
}

// Start the Currency Converter application
startCurrencyConverterApp();
