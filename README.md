# Vou Ali! - Sistema de Geolocalização e Rotas

### Equipe do Projeto
* **Integrantes:** Leandro Oliveira Lima
* **Período:** 3º Semestre
* **Curso/Disciplina:** Licenciatura em Computação - UFRB-FSA / Desenvolvimento de Software I
* **Professor:** Tassio Valle

---

## Descrição do Projeto
O **Vou Ali!** é uma aplicação web interativa em React para monitorar a localização atual e guiar o trajeto até um destino de interesse. A aplicação calcula e renderiza rotas reais baseadas em vias públicas e ruas em tempo real.

---

## Funcionalidades
1. **Geolocalização em Tempo Real**: Captura a posição física do dispositivo via GPS.
2. **Entrada Manual de Origem (Fallback)**: Caso o GPS esteja inativo ou sem permissão, o usuário pode digitar seu local de partida, que é convertido em coordenadas.
3. **Busca Simplificada de Destino**: O usuário define para onde quer ir digitando apenas o nome do lugar.
4. **Rotas Reais por Ruas**: Desenha o percurso real contornando quarteirões e avenidas no mapa (API OSRM) e calcula a distância exata de trajeto e a estimativa de tempo.
5. **Comparativo em Linha Reta**: Mantém em segundo plano o desenho da linha reta entre os pontos e o cálculo de distância direta (fórmula de Haversine).
6. **Bússola de Direção**: Ponteiro animado que rotaciona indicando o azimute/rumo do trajeto.
7. **Botão Enquadrar Rota**: Reajusta o zoom e os limites do mapa automaticamente para abranger a partida e o destino simultaneamente.
8. **Temas Claro & Escuro**: Interface configurada em tema claro por padrão, com alternador rápido para tema escuro.

---

## Estrutura de Componentes
O projeto demonstra conceitos fundamentais de desenvolvimento em React com componentes funcionais reutilizáveis e passagem unidirecional de propriedades (props):
- `App.jsx`: Componente contêiner principal responsável por gerenciar estados de geolocalização, buscar rotas nas APIs, efetuar cálculos geográficos e coordenar os dados.
- `Header.jsx`: Apresenta o título e o alternador de temas.
- `LocationCard.jsx`: Controla o ponto de partida (GPS ou endereço digitado manualmente).
- `DestinationSelector.jsx`: Campo para digitação simplificada do destino.
- `NavigationDashboard.jsx`: Agrupa a bússola visual e as métricas comparativas de viagem.
- `RouteMap.jsx`: Renderiza o mapa Leaflet, marcadores e as linhas de trajeto.

---

## Tecnologias Utilizadas
- **React.js & Vite**
- **Leaflet & React-Leaflet** (Mapas de código aberto)
- **API Nominatim OpenStreetMap** (Geocodificação de endereços)
- **API OSRM** (Cálculo de rota pelas vias públicas)
- **Lucide React** (Ícones da interface)
- **CSS Vanilla** (Estilização responsiva e efeitos visuais)

---

## Como Executar
1. Instale as dependências de pacotes do Node:
   ```bash
   npm install
   ```
2. Inicie o servidor local de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Abra a URL no navegador: `http://localhost:5173/`
