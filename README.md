# Simple Neubrutalism CSS

Uma biblioteca CSS simples e minimalista para criar interfaces com estilo Neubrutalism (Neo-Brutalismo).

## Sobre

O Simple Neubrutalism CSS é uma biblioteca com componentes básicos para criar interfaces com o estilo Neo-Brutalista, caracterizado por:
- Bordas marcantes
- Sombras pronunciadas
- Cores vibrantes
- Visual "bruto" e direto

## Características

- 🎨 Modo claro e escuro
- 🎯 Foco em simplicidade
- 📦 Componentes básicos prontos para uso
- 🗓 Componente customizado de date/datetime
- 🛠 Fácil de customizar através de variáveis CSS
- 🪶 Leve e sem dependências

## Exemplos

### Modo Claro
![Modo Claro](reademe_images/mode-light.png)

### Modo Escuro
![Modo Escuro](reademe_images/mode-dark.png)

## Uso

1. Adicione o loader unico no `head`:
```html
<script src="neubrutalism.js"></script>
```

Isso carrega automaticamente `neubrutalism.css` e os JS de `modal`, `tabs`, `select` e `datetime`.

2. Se preferir continuar no modo modular:
```html
<link rel="stylesheet" href="neubrutalism.css">
<script src="tags/modal.js"></script>
<script src="tags/tabs.js"></script>
<script src="tags/select.js"></script>
<script src="tags/datetime.js"></script>
```

3. Use os atributos e classes em seus elementos:
```html
<!-- Botão com estilo neubrutalism -->
<button>Clique aqui</button>

<!-- Input com estilo neubrutalism -->
<input type="text" placeholder="Digite algo...">

<!-- Datetime customizado -->
<nb-datetime name="appointment"></nb-datetime>

<!-- Elemento com borda neubrutalism -->
<div nbtl-border>Conteúdo</div>
```

## Dist e CDN

O projeto agora gera:

- `dist/neubrutalism.css` e `dist/neubrutalism.min.css`
- `dist/neubrutalism.js` e `dist/neubrutalism.min.js`
- `dist/neubrutalism.all.js` e `dist/neubrutalism.all.min.js`
- `dist/tags/*.js`, `dist/tags/*.min.js`, `dist/tags/*.css`, `dist/tags/*.min.css`

Build local:

```bash
npm install
npm run build
```

CDN full-all via jsDelivr depois de publicar no npm:

```html
<script src="https://cdn.jsdelivr.net/npm/@mangarosa/simple-neubrutalism@1.0.1/dist/neubrutalism.all.min.js"></script>
```

CDN modular:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mangarosa/simple-neubrutalism@1.0.1/dist/neubrutalism.min.css">
<script src="https://cdn.jsdelivr.net/npm/@mangarosa/simple-neubrutalism@1.0.1/dist/tags/select.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mangarosa/simple-neubrutalism@1.0.1/dist/tags/datetime.min.js"></script>
```

## Publicação automática

Os workflows em `.github/workflows/` fazem:

- build de `dist/` em push/PR
- publish no npm ao subir uma tag `v*.*.*`

Você precisa adicionar o secret `NPM_TOKEN` no GitHub.

Criar token no npm:

- Acesse `npmjs.com` em Account Settings > Access Tokens
- Link direto: https://www.npmjs.com/settings/tokens
- Crie um token do tipo `Automation`

Adicionar no GitHub:

- Repositório > `Settings` > `Secrets and variables` > `Actions`
- `New repository secret`
- Nome: `NPM_TOKEN`
- Valor: cole o token gerado no npm

Fluxo de release:

1. Atualize a versão no `package.json`
2. Faça commit
3. Crie a tag com a mesma versão do `package.json`
4. Envie a tag para o remoto

Exemplo:

```bash
git add package.json package-lock.json
git commit -m "release: v1.0.1"
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

Observação: o workflow agora falha se a tag `vX.Y.Z` não bater com o campo `version` do `package.json`.

## Customização

Você pode personalizar as cores e medidas através das variáveis CSS:

```css
:root {
  --primary-color: #FFD93D;
  --border-color: #4C3D3D;
  --background-color: #FFF8E3;
  --font-color: #4C3D3D;
  --secondary-color: #FFB200;
  --border-size-default: 3px;
  --box-shadow-size-default: 6px;
}
```
