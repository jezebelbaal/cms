# CMS - Marighella


![Carolos Marighella]
(http://marighella.github.io/cms/images/logo.png)

O Marighella é uma iniciativa dedicada a empoderar coletivos, movimentos sociais e organizações populares através da tecnologia. O nome é uma homenagem ao revolucionário Carlos Marighella, o negro guerrilheiro que balançou o Brasil ao lutar contra as opressões sobre o povo.


## O que é?

É um Gerenciador de Conteúdo (CMS) baseado em software livre e no conceito da tecnologia popular - tecnologia do povo para o povo. Pensada e construída nestes termos, a plataforma objetiva trabalhar com os desafios e características de iniciativas populares. Para tal, pretende ser leve, simples e deixar que os usuários foquem apenas na produção do conteúdo.


## Como desenvolver?


### Pré-requisitos:

#### Local

* [ruby](https://www.ruby-lang.org/en/installation/)
* [sass](http://sass-lang.com/install)
* [node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
* [bower](http://bower.io/#install-bower)
* [grunt-cli](http://gruntjs.com/getting-started)
* [EditorConfig](http://editorconfig.org/#overview)

#### Github

* [jekyll/github pages](http://jekyllrb.com/)


### Instalando dependências


Instalando os pacotes NodeJS

``
$ npm install
``

Instalando os pacotes do Frontend do projeto via Bower

``
$ bower install
``


### Executando em sua máquina local
``
$ grunt serve
``

A aplicação será executada no endereço `http://localhost:9000`.


## Como funciona?

O Gerenciador de Conteúdo (CMS) Marighella foi construído em AngularJS e é hospedado no Github Pages. Através da Github API, o conteúdo gerado é submetido para um repositório no Github através de um commit. Esse repositório, por sua vez, contém o Jekyll, marcações (HTML + CSS) e todas as postagens.

Para a publicação deste conteúdo, também usamos o Github Pages. Utilizando a API do Github o Marighella faz um commit para o repositório onde o usuário possui o site, se você estiver usando o Jekyll com geração automatica do github o resto é ele, caso não utilize o GH com geração de páginas automaticas, por qualquer motivo seja esse pluglins de terceiros, sugerimos que utilize algum [Servidor de Integração](snap-ci.com) para realizar uma implantação do conteudo.


## Como colaborar?

Esta plataforma é levada a cabo por um time dedicado a melhorá-la constantesmente. Como vocês podem imaginar, o desafio é grande! Colaboração é a chave para nos manter-mos relevantes para mais e mais movimentos/organizações sociais.

Queremos (e precisamos) de ajuda para trabalhar no Marighella. Se você tem interesse em nos ajudar, em tirar alguma dúvida, em pegar mais contexto, fique a vontade para nos contactar. Qualquer um dos desenvolvedores deste repositório irá respondê-lo.

Também criamos uma box vagrant com todas as dependências necessárias para facilitar a vida de novos contribuidores que chamamos carinhosamente de [Marighella-Box](https://github.com/marighella/marighella-box)


