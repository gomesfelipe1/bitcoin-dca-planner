
export const fetchHistoricalBTCPrice = async (date: string): Promise<number | null> => {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${date}`;
    console.log(`Fetching historical price for ${date}...`);
    
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch price for ${date}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    const price = data.market_data?.current_price?.usd;
    
    if (!price) {
      console.warn(`No price data available for ${date}`);
      return null;
    }
    
    console.log(`Price for ${date}: $${price}`);
    return price;
  } catch (error) {
    console.error(`Error fetching historical price for ${date}:`, error);
    return null;
  }
};

export const fetchCurrentBTCPrice = async (): Promise<number> => {
  try {
    console.log("Fetching current Bitcoin price...");
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch current price: ${response.status}`);
    }
    
    const data = await response.json();
    const price = data.bitcoin.usd;
    
    if (!price) {
      throw new Error("No current price data available");
    }
    
    console.log(`Current Bitcoin price: $${price}`);
    return price;
  } catch (error) {
    console.error("Error fetching current Bitcoin price:", error);
    throw error;
  }
};
