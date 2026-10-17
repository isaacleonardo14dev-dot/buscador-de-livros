# Documentação do Projeto: Buscador de Livros

## Identificação do Autor
* **Nome:** Isaac Leonardo
* **Matrícula:** 22607082
* **GitHub:** [isaacleonardo14dev-dot](https://github.com/isaacleonardo14dev-dot)
* **Docker Hub:** [isaacleonaradodev](https://hub.docker.com/r/isaacleonaradodev/bootcamp2-app)

---

## 1, 2, 3 e 4. Links do Projeto e Comando de Execução

1. **Repositório no GitHub:** [https://github.com/isaacleonardo14dev-dot/buscador-de-livros](https://github.com/isaacleonardo14dev-dot/buscador-de-livros)
2. **Aplicação no GitHub Pages:** [https://isaacleonardo14dev-dot.github.io/buscador-de-livros/](https://isaacleonardo14dev-dot.github.io/buscador-de-livros/)
3. **Repositório no Docker Hub:** [https://hub.docker.com/r/isaacleonaradodev/bootcamp2-app](https://hub.docker.com/r/isaacleonaradodev/bootcamp2-app)
4. **Comando `docker run` para execução:**
```bash
docker run -d -p 8080:80 isaacleonaradodev/bootcamp2-app:1.0

Endereço de acesso no navegador após inicialização: http://localhost:8080Descrição da AplicaçãoAplicação web para pesquisa de obras literárias em tempo real utilizando a API pública Open Library.
A solução permite consultar detalhes de livros e autores, além de fornecer gerenciamento e salvamento de itens favoritos em banco de dados remoto.5. 
Persistência de Dados (Supabase)Banco de Dados Utilizado: Supabase (PostgreSQL hospedado na nuvem).Dados Salvos: Informações das obras marcadas como favoritas pelo usuário (título, autor, URL da capa e chave única da obra work_key).
Estrutura da Tabela (favoritos):ColunaTipo de DadoDescriçãoidbigint / uuidIdentificador único gerado automaticamente pelo bancotitletextTítulo completo da obra armazenadaauthortextNome do autor ou autorescover_urltextURL da imagem de capa do livrowork_keytextChave identificadora única na Open Library APIcreated_attimestampRegistro de data e hora do salvamento6. 
Evidências das Sidequests (SQ1 a SQ4)SQ1: Otimização com .dockerignoreDescrição: Configuração do arquivo .dockerignore com a exclusão de diretórios e arquivos de desenvolvimento (.git, .gitignore, .vscode, README.md).
Justificativa Técnica: A exclusão desses arquivos reduz a quantidade de dados transferidos para o daemon do Docker durante o processo de build, resultando em menor tamanho de imagem, melhor reaproveitamento de cache e maior velocidade na compilação.SQ2: 
Versionamento de ImagensDescrição: Publicação da imagem no Docker Hub utilizando versionamento formal com as tags 1.0, 1.1 e latest.SQ3: 
Descrição e Documentação no Docker HubDescrição: Preenchimento completo da seção Overview no repositório do Docker Hub, contendo instruções de uso, comando de execução e hiperlink para o código-fonte.SQ4: 
Orquestração de Containers e EvidênciasExecução Simultânea: Inicialização de duas instâncias da mesma imagem rodando em portas distintas:Bashdocker run -d -p 8080:80 --name app-1 isaacleonaradodev/bootcamp2-app:1.0
docker run -d -p 8081:80 --name app-2 isaacleonaradodev/bootcamp2-app:1.0



Evidências do docker ps (Commitadas no repositório):Gerenciamento em Larga Escala (Kubernetes):Para o gerenciamento de 100 ou mais containers, o controle manual via Docker CLI torna-se inviável. A abordagem recomendada é o uso de um orquestrador como o Kubernetes (K8s). Nele, as instâncias são agrupadas em Pods gerenciados por Deployments dentro de um Cluster. O Kubernetes garante balanceamento de carga automático, escalabilidade horizontal (HPA), atualização sem interrupção (rolling updates) e autorregeneração das aplicações em caso de falha (self-healing