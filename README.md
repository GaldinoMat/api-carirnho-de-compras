### Carrinho de compras

Simples api de carrinho de compras, utilizando um documento json como database para alimentar o site dinamicamente.


### Estrutura

A api pega os items assincronamente do documento utilizando a função **getProducts()**, utilizando o descontructor do ECMA6 para atribuir dinamicamente certos atributos a um único objeto.

Tais objetos são guardados no localStorage do browser com a função statica **saveProductsData()**, para que o site/api não tenha que ficar recuperando a lista de items cada vez que o site for carregado.
    
Uma função similar foi escrita para salvar o carrinho de compras assim como recupera-lo, **saveCart()** e **getCart()** respectivamente, para que um eventual cliente não precise recolocar os itens no carrinho toda vez que precisar fechar o site.

A UI do site é populada dinamicamente pela Api com **displayProducts()**, evitando a necessidade de colocar manualmente os elementos no html, deixando o documento extremamente poluído e confuso. Ao mesmo tempo que os botões encarregados de colocar cada produto no carrinho são desativados quando um objeto é escolhido. Decidi fazer tal funcionalidade para evitar objetos repetidos no carirnho, podendo "quebrar" o layout do mesmo.

Sendo assim, a quantidade de items é decidida dentro do próprio carrinho.

A UI do carrinho também é populada dinamicamente, com o preço total atualizado com cada item adicionado ou removido, e o preço de cada produto sendo atualizado caso o preço total ultrapasse a casa previamente estipulada de R$ 10,00.

### Aprendizado

Descobri que é muito mais interessante deixar as coisas mais dinâmicas e modulares possíveis. Um banco de dados, por menor que seja, é modificado com frequência e pode acarretar em sérios problemas se tais mudanças não forem levadas em conta. Um layout previamente definido e que possa servir de exmplo ajuda bastante na dinamicidade da API, já que evita mudanças de última hora/futuros problemas.

Minha maior preocupação, além de popular a lista de produtos, foi salva-lá para que o site não impusesse uma carga desnecessária ao usuário tendo que carrega-lá todas as vezes que este entrasse em seu dominio. 
    
Aplicar a mesma lógica ao carrinho de compras também é algo interessante, e creio que as duas abordagens podem ser utilizadas com sucesso até certo ponto, contanto que a lista de produtos não ultrapasse um certo ponto.