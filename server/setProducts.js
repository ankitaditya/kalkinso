const Products = require('../models/Products')
const connectDB = require('../config/db');
const jwt = require('jsonwebtoken')
connectDB();
const products = [
    'SHIRT',
    'HOODIE'
]

const descriptions = {
    SHIRT: "Elevate your wardrobe with our classic shirt, tailored for a perfect fit and crafted with premium, breathable fabric. Ideal for both formal and casual occasions, this shirt ensures you stay stylish and comfortable all day.",
    HOODIE: "Stay warm and cozy in our stylish hoodie, designed to keep you comfortable in all weather conditions. Made with premium fabric, this hoodie is perfect for casual outings and everyday wear."
}

const prices = {
    SHIRT: 550,
    HOODIE: 900
}

const colors = [
    '#282E44',
    '#A33447',
    '#2C5C4C',
    '#D2BAA0',
    '#D3D0CB',
    '#000000'
]

const sizes = [
    'L',
    'XL',
    'M'
]

const textures = [
    "./styles/1B_025.png",                              "./styles/I_008.png",                               "./styles/Picsart_24-12-25_18-34-59-490.png",
    "./styles/1E_016.png",                              "./styles/I_027.png",                               "./styles/Picsart_24-12-25_19-05-28-594.png",
    "./styles/A_024.png",                               "./styles/P_005.png",                               "./styles/Picsart_24-12-25_19-08-26-881.png",
    "./styles/F_008.png",                               "./styles/P_089.png",                               "./styles/Picsart_24-12-25_19-12-06-351.png",
    "./styles/F_039.png",                               "./styles/P_106.png",                               "./styles/Picsart_24-12-25_19-16-58-200.png",
    "./kalkinso.png"
     ]

let product = {
    "id": "PROD-SHIRT-L-A33447-1B_025",
    "sku": "Shirt",
    "title": "Shirt",
    "description": "Elevate your wardrobe with our classic shirt, tailored for a perfect fit and crafted with premium, breathable fabric. Ideal for both formal and casual occasions, this shirt ensures you stay stylish and comfortable all day.",
    "availableSizes": ["L"],
    "style": "Standard",
    "price": 550,
    "color": "#A33447",
    "isLogoTexture": false,
    "isBaseTexture": true,
    "texture": "./styles/1B_025.png",
    "installments": 1,
    "currencyId": "INR",
    "currencyFormat": "₹",
    "isFreeShipping": false,
    "quantity": 1
}

let qt = 0

let id_list = []

for ( const p_id in products ) {
    let id = "PROD"
    for ( const s_id in sizes ) {
        for (const c_id in colors) {
                qt += 1
                console.log(qt)
                id_list.push(`${id}-${products[p_id]}-${sizes[s_id]}-${colors[c_id].replace('#','')}`)
                // product.id = `${id}-${products[p_id]}-${sizes[s_id]}-${colors[c_id].replace('#','')}`
                // product.sku = products[p_id].slice(0,1).toLocaleUpperCase()+products[p_id].slice(1).toLocaleLowerCase()
                // product.title = products[p_id].slice(0,1).toLocaleUpperCase()+products[p_id].slice(1).toLocaleLowerCase()
                // product.description = descriptions[products[p_id]]
                // product.availableSizes = [sizes[s_id]]
                // product.style = 'Standard'
                // product.price = prices[products[p_id]]
                // product.color = colors[c_id]
                // product.isLogoTexture = false
                // product.isBaseTexture = true
                // product.texture = './kalkinso.png'
                // product.installments = 1
                // product.currencyId = "INR"
                // product.currencyFormat = "₹"
                // product.isFreeShipping = false
                // product.quantity = 5
                // const prod = new Products({
                //     ...product
                //     });
                //     prod.save().then(res=>{
                //     console.log("SAVED: "+res.id)
                // }).catch(error=>{
                //     console.log("NOT SAVED: "+product.id)    
                // })
        }
    }
}

console.log("SUCCESSFULLY UPDATED THE DATABASE")

// console.log(`${products.length}*${colors.length}*${sizes.length}=${products.length*colors.length*sizes.length}`)
// console.log(id_list)
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();
async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImE3MWI1MTU1MmI0ODA5OWNkMGFkN2Y5YmZlNGViODZiMDM5NmUxZDEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQW5raXQgQWR3aXR5YSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJdEJKMVJCamVpOWhCYmFsdk1GU1lsbTRRZVI2MjdCZDZTaEt0VDQ5dG1kSEhnVzFicT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9rYWxraW5vLW9yZyIsImF1ZCI6ImthbGtpbm8tb3JnIiwiYXV0aF90aW1lIjoxNzM1MzIzMDc1LCJ1c2VyX2lkIjoiTDJUeU9xSnVUTFhuQ0tyNE84WWxDMm1NbXZCMyIsInN1YiI6IkwyVHlPcUp1VExYbkNLcjRPOFlsQzJtTW12QjMiLCJpYXQiOjE3MzUzMjMwNzUsImV4cCI6MTczNTMyNjY3NSwiZW1haWwiOiJhbmtpdC5zZWVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTYyMTIzNjU0NjI1MzU5OTY3ODUiXSwiZW1haWwiOlsiYW5raXQuc2VlQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.YUxsGWzRuuPZytvO1pEuxbB7d3b8ety8xP1Y6_RyHHcGbmm-C5DXs_qcLTCrBSHbH__B6AKZAR52IaoVeD_GggI5LjPRI2A8YeLz_kfevELr9ln2KRKvDx_0r47qjfkgdgn1hlYMqxR_xFXBJPdsaj9_LLGZXsXfUjzHPUcr6yHzL8mCkR5aHE1MCNNRXmlMXmExRR-z2s-RdT-O-4csnIRK37RFMHw_De0cb2YWzUBWlBpqwNDMBpyfn9VyqBe6cubND9HpNqGrRlsu8DfkzrfAMPv_LEx-Y_NBYlNZoXMuON0LesqfYcULmnLiMWGz7AErL_Kq3NOnEq5ry7Y4zQ',
        audience: '919289249233-4d81cn32mmnlouf3c56t4ke9rf2baa1j.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If the request specified a Google Workspace domain:
    // const domain = payload['hd'];
  }
  verify().catch(console.error);