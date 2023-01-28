<h1 align="left">My Wallet 💰</h1>

###

<p align="left">Esta é uma API (Application Programming Interface) de uma carteira virtual.</p>

<p> Acesse também o front-end da aplicação => https://github.com/brunnaserafina/my-wallet </p>

###

### ⚙️ Funcionalidades

- Cadastro
- Login
- Logout
- Listar transações
- Adicionar transação

</br>

### 📄 Documentação da API

##### CADASTRO:

```http
  POST /sign-up
```
- Body:

| Parâmetro       | Tipo     | Descrição                           |
| :-------------- | :------- | :-----------------------------------|
| `name`          | `string` | `Nome do usuário`                   |
| `email`         | `string` | `E-mail do usuário`                 |
| `password`      | `string` | `Senha do usuário`                  |
| `repeatPassword`| `string` | `Repetição de senha para confirmar` |

--
##### LOGIN:

```http
  POST /sign-in
```
- Body:

| Parâmetro  | Tipo     | Descrição           |
| :--------- | :------- | :-------------------|
| `email`    | `string` | `E-mail do usuário` |
| `password` | `string` | `Senha do usuário`  |

--
##### LOGOUT:

```http
  DELETE /sign-out
```

- Headers:

| Parâmetro      | Tipo     | Descrição         |
| :--------------| :------- | :-----------------|
| `Authorization`| `string` | `Bearer ${token}` |

--
##### LISTAR TRANSAÇÕES:

```http
  GET /transactions
```

- Headers:

| Parâmetro      | Tipo     | Descrição         |
| :--------------| :------- | :-----------------|
| `Authorization`| `string` | `Bearer ${token}` |

--

##### ADICIONAR TRANSAÇÃO:

```http
  POST /transactions
```
- Body:

| Parâmetro     | Tipo     | Descrição                             |
| :------------ | :------- | :-------------------------------------|
| `value`       | `number` | `Valor da transação   `               |
| `description` | `string` | `Descrição da transação`              |
| `type`        | `string` | `Tipo de transação: saída ou entrada` |


- Headers:

| Parâmetro      | Tipo     | Descrição         |
| :--------------| :------- | :-----------------|
| `Authorization`| `string` | `Bearer ${token}` |

--

</br>

### ▶️ Rodando a aplicação

1. Crie ou selecione uma pasta com o nome de sua preferência
2. Clone este repositório na pasta criada/selecionada:

```bash
 $ git clone https://github.com/brunnaserafina/my-wallet-api.git
```
3. Instale suas depêndencias:

```bash
   npm i
```
4. Caso não tenha, instale o banco de dados MongoDB na sua máquina

5. Inicie o servidor mongo:
```bash
   $ mongod --dbpath ~/.mongo
```
6. Conecte-se ao servidor mongo:
```bash
  $ mongo
```
7. Inicie a aplicação na raíz do projeto:

```bash
   npx nodemon src/app.js
```

</br>

### 🛠️ Tecnologias utilizadas

 <img align="left" alt="node" height="30px" src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
 <img align="left" alt="express" height="30px" src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" />

 <img align="left" alt="mongodb" height="30px" src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" />
 <img align="left" alt="mongodb" height="30px" src="https://img.shields.io/badge/bcrypt-%20-green" />
 <img align="left" alt="cors" height="30px" src="https://img.shields.io/badge/cors-%20-red" />
 <img align="left" alt="cors" height="30px" src="https://img.shields.io/badge/day-JS%20-orange" />
 <img align="left" alt="cors" height="30px" src="https://img.shields.io/badge/uuid-%20-brightgreen" />
 


</br>
</br>

### 🙇🏻‍♀️ Autora

- Feito com ❤️ por [@brunnaserafina](https://www.github.com/brunnaserafina)

