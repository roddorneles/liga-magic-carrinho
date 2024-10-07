import axios from "axios";
import { load } from "cheerio";
import fs from 'fs/promises';

const main = async () => {

    // nome da carta que se quer adicionar ao carrinho
    let cardToSearch = "sol ring";

    cardToSearch.replace(' ', '+');

    // Requisição que retorna a página com o estoque disponível
    let response = await axios.get(`https://www.mtgcardsgames.com.br/?view=ecom%2Fitens&id=15760&searchExactMatch=1&busca=${cardToSearch}`, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "Priority": "u=0, i",
        },
        "method": "GET",
        "mode": "cors"
    });

    // Escreve arquivo HTML para verificar
    await fs.writeFile(`./teste.html`, response.data, (err) => {
        if (err) {
            console.error('Error while saving file:', err);
            return;
        }
    });

    let $ = load(response.data);

    const $rowCard = $('.table-cards-row').first();

    const onClickProperty = $rowCard.find('.add_prod li').first().attr('onclick');

    let storeCardId = onClickProperty.match(/\d+(?=\))/)[0]; // regex para encontrar uma string de inteiros seguidos por um )

    const url = `https://www.mtgcardsgames.com.br/ajax/ecom/carrinho.php?t=1&id=${storeCardId}&q=1`;

    response = await axios.get(url, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "Priority": "u=0, i",
            "Cookie": "carrinhoEcom=codelab123"
        },
        "method": "GET",
        "mode": "cors"
    });

    console.log("Adicionado ao carrinho!");

    // Para verificar o carrinho, basta ir ao navegador, e modificar o valor do cookie "carrinhoEcom" para "codelab123"

};

main()