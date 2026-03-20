import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsPath = path.resolve(__dirname, '../src/data/models.json');

const modelsData = fs.readFileSync(modelsPath, 'utf8');
const models = JSON.parse(modelsData);

function parsePrice(cents) {
  if (!cents || isNaN(cents)) return null;
  // In Shopify, price is often in cents/100 or sometimes an integer like 259900
  // Usually Shopify returns 259900 for 2599.00
  const liras = cents / 100;
  return liras.toLocaleString('tr-TR') + ' TL';
}

async function scrapePrices() {
  console.log('Starting advanced price scrape from tr.stanley1913.com (Checking inside .js files)...');
  
  for (const model of models) {
    console.log(`\nProcessing model: ${model.name}`);
    
    // We now do a targeted search per variant to bypass Shopify's search 5-item limit
    for (const variant of model.variants) {
      const capNum = variant.capacity;
      const capStr1 = capNum.toString();
      const capStr2 = capStr1.replace('.', ',');
      const mlStr = `${Math.round(capNum * 1000)}`;
      
      console.log(` Searching for Variant ${capNum}L...`);
      
      // Attempt targeted searches PLUS generic searches to ensure we get a wide net
      const queriesToTry = [
          model.name,
          `${model.name.split(' ')[0]} ${mlStr}`,
          `${model.name.split(' ')[0]} ${capStr1}`,
          `${model.name.split(' ').slice(0, 3).join(' ')} ${mlStr}`
      ];

      let allShopifyVariants = [];

      for (const q of queriesToTry) {
          const url = `https://tr.stanley1913.com/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product`;
          try {
            const response = await fetch(url);
            const data = await response.json();
            const products = data?.resources?.results?.products || [];
            
            for (const p of products.slice(0, 3)) { // Check top 3 hits per targeted query
                try {
                    const prodRes = await fetch(`https://tr.stanley1913.com/products/${p.handle}.js`);
                    if (prodRes.ok) {
                        const prodData = await prodRes.json();
                        if (prodData.variants) {
                            prodData.variants.forEach(v => {
                                v._productTitle = prodData.title; 
                                allShopifyVariants.push(v);
                            });
                        }
                    }
                } catch(e) {}
            }
          } catch(e) {}
      }

      function extractCapacityMl(text) {
        if (!text) return [];
        const results = [];
        const regex = /([\d]+(?:[.,][\d]+)?)\s*(ml|l|lt|litre)?/gi;
        let match;
        while ((match = regex.exec(text)) !== null) {
          let num = parseFloat(match[1].replace(',', '.'));
          if (isNaN(num)) continue;
          
          let unit = match[2] ? match[2].toLowerCase() : null;
          if (unit) {
            if (unit.startsWith('l')) num *= 1000;
          } else {
            if (num > 0 && num < 15) num *= 1000; 
          }
          
          if (num >= 50 && num <= 5000) {
            results.push(Math.round(num));
          }
        }
        return results;
      }

      // Step 2: Match our model.variants with the extracted allShopifyVariants
      const targetMl = Math.round(capNum * 1000);

      // Heuristic: check variant title or parent product title using fuzzy ML matching
      let matchedShopifyVariant = allShopifyVariants.find(sv => {
          const textToSearch = sv.title + " " + (sv._productTitle || "");
          const extractedMls = extractCapacityMl(textToSearch);
          
          return extractedMls.some(ml => {
              const diff = Math.abs(ml - targetMl);
              return (diff / targetMl) < 0.05; // 5% tolerans
          });
      });

      // If missing and only 1 variant expected, default to first found
      if (!matchedShopifyVariant && model.variants.length === 1 && allShopifyVariants.length > 0) {
        matchedShopifyVariant = allShopifyVariants[0];
      }

      if (matchedShopifyVariant) {
        const rawPrice = matchedShopifyVariant.price; 
        const formattedPrice = parsePrice(rawPrice);
        if (formattedPrice && matchedShopifyVariant.available) {
          variant.price = formattedPrice;
          console.log(`  [HIT] Variant ${capNum}L -> ${formattedPrice}`);
        } else {
          variant.price = "Stokta Yok";
          console.log(`  [EMPTY] Variant ${capNum}L -> Stokta Yok (Raw: ${rawPrice}, Avail: ${matchedShopifyVariant.available})`);
        }
      } else {
        variant.price = "Stokta Yok";
        console.log(`  [MISS] No match for Variant ${capNum}L`);
      }
      
      // Delay to go easy on the server
      await new Promise(r => setTimeout(r, 600));
    }
  }
  
  fs.writeFileSync(modelsPath, JSON.stringify(models, null, 2), 'utf8');
  console.log('\nSaved updated models.json');
}

scrapePrices();
