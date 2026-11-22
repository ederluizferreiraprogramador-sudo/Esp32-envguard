// Unidades 9 a 16 do FenixInglês (ordem do livro-base; conteúdo original).
import type { Lesson } from "./units";

export const unit9: Lesson[] = [
  {
    title: "Comidas básicas",
    activities: [
      { type: "match", pairs: [["bread", "pão"], ["rice", "arroz"], ["beans", "feijão"], ["chicken", "frango"]], explain: "Comidas básicas." },
      { type: "match", pairs: [["milk", "leite"], ["cheese", "queijo"], ["eggs", "ovos"], ["fruit", "fruta"]], explain: "Mais comidas." },
      { type: "fill", before: "I need", after: "milk.", options: ["some", "a", "an"], answer: "some", explain: "milk é incontável → some." },
      { type: "fill", before: "I want", after: "apple.", options: ["an", "a", "some"], answer: "an", explain: "apple é contável e começa com vogal → an." },
      { type: "fill", before: "Do we have", after: "eggs?", options: ["any", "a", "an"], answer: "any", explain: "Em perguntas: any." },
      { type: "choose", line: "Do you have any bread?", options: ["Yes, I have some.", "Yes, I have any.", "Yes, I have a bread."], answer: "Yes, I have some.", explain: "Afirmativo: some." },
      { type: "listen", audio: "We don't have any cheese.", options: ["We don't have any cheese.", "We have some cheese.", "We don't have any chicken."], answer: "We don't have any cheese.", explain: "Negativo: any." },
      { type: "write", prompt: "frango", answer: ["chicken"], explain: "frango = chicken." },
    ],
  },
  {
    title: "Café da manhã e refeições",
    activities: [
      { type: "match", pairs: [["breakfast", "café da manhã"], ["lunch", "almoço"], ["dinner", "jantar"], ["snack", "lanche"]], explain: "Refeições." },
      { type: "fill", before: "I have coffee for", after: ".", options: ["breakfast", "dinner", "night"], answer: "breakfast", explain: "for breakfast = no café da manhã." },
      { type: "choose", line: "What do you have for lunch?", options: ["I usually have rice and beans.", "I'm having lunch.", "At noon."], answer: "I usually have rice and beans.", explain: "A pergunta é \"o que\" você come." },
      { type: "build", pt: "Eu como pão no café da manhã.", answer: "I eat bread for breakfast", extra: ["in", "eats"], explain: "for breakfast." },
      { type: "listen", audio: "We have dinner at eight.", options: ["We have dinner at eight.", "We have lunch at eight.", "We have dinner at night."], answer: "We have dinner at eight.", explain: "have dinner = jantar." },
      { type: "fill", before: "She", after: "a sandwich for lunch.", options: ["has", "have", "haves"], answer: "has", explain: "she + has." },
      { type: "write", prompt: "jantar", answer: ["dinner"], explain: "jantar = dinner." },
      { type: "choose", line: "Is fruit healthy?", options: ["Yes, it is.", "Yes, they are.", "Yes, it does."], answer: "Yes, it is.", explain: "fruit (incontável) → it is." },
    ],
  },
  {
    title: "Com que frequência?",
    activities: [
      { type: "match", pairs: [["always", "sempre"], ["usually", "geralmente"], ["sometimes", "às vezes"], ["never", "nunca"]], explain: "Advérbios de frequência." },
      { type: "match", pairs: [["often", "frequentemente"], ["hardly ever", "quase nunca"], ["healthy", "saudável"], ["junk food", "porcaria"]], explain: "Mais frequência e hábitos." },
      { type: "build", pt: "Eu sempre tomo café da manhã.", answer: "I always eat breakfast", extra: ["eats", "never"], explain: "O advérbio vem antes do verbo principal." },
      { type: "build", pt: "Ela nunca bebe refrigerante.", answer: "She never drinks soda", extra: ["drink", "always"], explain: "she + never + drinks." },
      { type: "fill", before: "I", after: "eat fish. (às vezes)", options: ["sometimes", "always", "never"], answer: "sometimes", explain: "sometimes = às vezes." },
      { type: "choose", line: "Qual frase está correta?", options: ["He is always late.", "He always is late.", "Always he is late."], answer: "He is always late.", explain: "Com o verbo be, o advérbio vem depois: is always." },
      { type: "listen", audio: "I hardly ever eat junk food.", options: ["I hardly ever eat junk food.", "I always eat junk food.", "I hardly eat good food."], answer: "I hardly ever eat junk food.", explain: "hardly ever = quase nunca." },
      { type: "write", prompt: "sempre", answer: ["always"], explain: "sempre = always." },
    ],
  },
];

export const unit10: Lesson[] = [
  {
    title: "Esportes",
    activities: [
      { type: "match", pairs: [["soccer", "futebol"], ["basketball", "basquete"], ["volleyball", "vôlei"], ["swimming", "natação"]], explain: "Esportes." },
      { type: "fill", context: "A: What sports do you like?", before: "B: I like", after: "and tennis.", options: ["soccer", "soccers", "a soccer"], answer: "soccer", explain: "Nome de esporte não leva artigo." },
      { type: "fill", before: "What sports", after: "you play?", options: ["do", "does", "are"], answer: "do", explain: "you → do." },
      { type: "fill", before: "Who", after: "your favorite player?", options: ["is", "are", "do"], answer: "is", explain: "Who + is (singular)." },
      { type: "choose", line: "Do you like volleyball?", options: ["Yes, I love it!", "Yes, I love.", "Yes, I'm love it."], answer: "Yes, I love it!", explain: "love precisa de objeto: love it." },
      { type: "build", pt: "Meu irmão joga basquete aos sábados.", answer: "My brother plays basketball on Saturdays", extra: ["play", "in"], explain: "he + plays; on Saturdays." },
      { type: "listen", audio: "When do you go swimming?", options: ["When do you go swimming?", "Where do you go swimming?", "When do you play soccer?"], answer: "When do you go swimming?", explain: "When = quando." },
      { type: "write", prompt: "futebol", answer: ["soccer", "football"], explain: "futebol = soccer (EUA) / football (Reino Unido)." },
    ],
  },
  {
    title: "Can: habilidades",
    activities: [
      { type: "fill", before: "I", after: "swim.", options: ["can", "cans", "can to"], answer: "can", explain: "can + verbo, igual para todas as pessoas." },
      { type: "fill", before: "She", after: "drive. She doesn't know how.", options: ["can't", "doesn't", "isn't"], answer: "can't", explain: "can't = não sabe/não consegue." },
      { type: "choose", line: "Can you play the guitar?", options: ["Yes, I can.", "Yes, I do.", "Yes, I play."], answer: "Yes, I can.", explain: "Can → can." },
      { type: "build", pt: "Ele sabe cozinhar muito bem.", answer: "He can cook very well", extra: ["cans", "good"], explain: "\"well\" (bem) é advérbio; \"good\" é adjetivo." },
      { type: "build", pt: "Você sabe falar espanhol?", answer: "Can you speak Spanish", extra: ["do", "speaks"], explain: "Pergunta: Can + you + verbo?" },
      { type: "listen", audio: "I can't sing.", options: ["I can't sing.", "I can sing.", "I can't swim."], answer: "I can't sing.", explain: "Em inglês americano, \"can't\" tem som de vogal mais longo." },
      { type: "match", pairs: [["sing", "cantar"], ["dance", "dançar"], ["draw", "desenhar"], ["fix", "consertar"]], explain: "Habilidades." },
      { type: "choose", line: "Can she dance?", options: ["No, she can't.", "No, she doesn't.", "No, she isn't."], answer: "No, she can't.", explain: "Can → can't." },
    ],
  },
  {
    title: "Talentos",
    activities: [
      { type: "fill", before: "What", after: "you do? (que habilidades)", options: ["can", "are", "is"], answer: "can", explain: "What can you do? = O que você sabe fazer?" },
      { type: "fill", before: "Who", after: "fix a car?", options: ["can", "cans", "does"], answer: "can", explain: "Who can...? = Quem sabe...?" },
      { type: "choose", line: "What can your sister do?", options: ["She can draw and paint.", "She can draws.", "She cans draw."], answer: "She can draw and paint.", explain: "can + verbo sem -s." },
      { type: "listen", audio: "How well can you swim?", options: ["How well can you swim?", "How often do you swim?", "Where can you swim?"], answer: "How well can you swim?", explain: "How well = quão bem." },
      { type: "match", pairs: [["well", "bem"], ["very well", "muito bem"], ["a little", "um pouco"], ["not at all", "nem um pouco"]], explain: "Respostas sobre habilidade." },
      { type: "build", pt: "Eu consigo tocar piano um pouco.", answer: "I can play the piano a little", extra: ["plays", "much"], explain: "play the piano; a little = um pouco." },
      { type: "write", prompt: "dançar", answer: ["dance"], explain: "dançar = dance." },
      { type: "choose", line: "Can you speak English?", options: ["Yes, a little.", "Yes, I speak.", "Yes, I can't."], answer: "Yes, a little.", explain: "a little = um pouco." },
    ],
  },
];

export const unit11: Lesson[] = [
  {
    title: "Meses e datas",
    activities: [
      { type: "match", pairs: [["January", "janeiro"], ["March", "março"], ["July", "julho"], ["December", "dezembro"]], explain: "Meses." },
      { type: "match", pairs: [["first", "1º"], ["second", "2º"], ["third", "3º"], ["twentieth", "20º"]], explain: "Números ordinais." },
      { type: "fill", context: "A: When is your birthday?", before: "B: It's", after: "May 5th.", options: ["on", "in", "at"], answer: "on", explain: "Data completa: on." },
      { type: "fill", before: "My birthday is", after: "October.", options: ["in", "on", "at"], answer: "in", explain: "Só o mês: in." },
      { type: "write", prompt: "abril", answer: ["april"], explain: "abril = April." },
      { type: "listen", audio: "It's on June twenty-first.", options: ["It's on June twenty-first.", "It's on July twenty-first.", "It's on June twenty-third."], answer: "It's on June twenty-first.", explain: "21st = twenty-first." },
      { type: "write", prompt: "3rd", answer: ["third"], explain: "3rd = third." },
      { type: "choose", line: "When is Christmas?", options: ["It's on December 25th.", "It's in December 25th.", "It's at Christmas."], answer: "It's on December 25th.", explain: "on + data." },
    ],
  },
  {
    title: "Planos: be going to",
    activities: [
      { type: "fill", before: "I'm going", after: "have a party.", options: ["to", "for", "at"], answer: "to", explain: "be going to + verbo." },
      { type: "fill", before: "She", after: "going to travel next week.", options: ["is", "are", "am"], answer: "is", explain: "she + is going to." },
      { type: "build", pt: "Nós vamos comer fora hoje à noite.", answer: "We are going to eat out tonight", extra: ["is", "for"], explain: "we + are going to + verbo." },
      { type: "choose", line: "Are you going to work tomorrow?", options: ["No, I'm not.", "No, I don't.", "No, I won't going."], answer: "No, I'm not.", explain: "Are → I'm not." },
      { type: "build", pt: "O que você vai fazer no sábado?", answer: "What are you going to do on Saturday", extra: ["is", "in"], explain: "What + are you going to + do?" },
      { type: "listen", audio: "He's going to visit his parents.", options: ["He's going to visit his parents.", "He's visiting his parents.", "He's going to call his parents."], answer: "He's going to visit his parents.", explain: "visit = visitar." },
      { type: "match", pairs: [["tonight", "hoje à noite"], ["tomorrow", "amanhã"], ["next week", "semana que vem"], ["this weekend", "este fim de semana"]], explain: "Expressões de futuro." },
      { type: "fill", before: "They", after: "going to watch a movie.", options: ["aren't", "isn't", "don't"], answer: "aren't", explain: "they + aren't going to." },
    ],
  },
  {
    title: "Feriados e festas",
    activities: [
      { type: "match", pairs: [["birthday", "aniversário"], ["holiday", "feriado"], ["party", "festa"], ["gift", "presente"]], explain: "Ocasiões especiais." },
      { type: "choose", line: "How are you going to celebrate?", options: ["I'm going to have dinner with friends.", "I celebrate yesterday.", "Yes, I'm going."], answer: "I'm going to have dinner with friends.", explain: "Responda com be going to." },
      { type: "fill", before: "We're going to", after: "New Year's Eve at the beach.", options: ["celebrate", "celebrates", "celebrating"], answer: "celebrate", explain: "going to + verbo na forma base." },
      { type: "build", pt: "Eu vou comprar um presente para ela.", answer: "I'm going to buy a gift for her", extra: ["she", "buys"], explain: "Depois de \"for\" use o pronome objeto: her." },
      { type: "listen", audio: "Happy birthday!", options: ["Happy birthday!", "Happy holidays!", "Happy New Year!"], answer: "Happy birthday!", explain: "Feliz aniversário!" },
      { type: "write", prompt: "festa", answer: ["party"], explain: "festa = party." },
      { type: "fill", before: "Who", after: "going to come to the party?", options: ["is", "are", "do"], answer: "is", explain: "Who + is going to." },
      { type: "choose", line: "Are your friends going to come?", options: ["Yes, they are.", "Yes, they going.", "Yes, they do."], answer: "Yes, they are.", explain: "Are → they are." },
    ],
  },
];

export const unit12: Lesson[] = [
  {
    title: "Partes do corpo",
    activities: [
      { type: "match", pairs: [["head", "cabeça"], ["arm", "braço"], ["leg", "perna"], ["back", "costas"]], explain: "Partes do corpo." },
      { type: "match", pairs: [["eye", "olho"], ["ear", "orelha"], ["hand", "mão"], ["foot", "pé"]], explain: "Mais partes do corpo." },
      { type: "write", prompt: "foot → plural", answer: ["feet"], explain: "Plural irregular: foot → feet." },
      { type: "write", prompt: "tooth → plural", answer: ["teeth"], explain: "Plural irregular: tooth → teeth." },
      { type: "listen", audio: "My back hurts.", options: ["My back hurts.", "My head hurts.", "My bag hurts."], answer: "My back hurts.", explain: "hurt = doer." },
      { type: "fill", before: "I have two", after: ".", options: ["hands", "hand", "handes"], answer: "hands", explain: "Plural regular: hands." },
      { type: "build", pt: "Meus olhos estão cansados.", answer: "My eyes are tired", extra: ["is", "eye"], explain: "eyes (plural) + are." },
      { type: "write", prompt: "cabeça", answer: ["head"], explain: "cabeça = head." },
    ],
  },
  {
    title: "Como você se sente?",
    activities: [
      { type: "fill", before: "I have a", after: ".", options: ["headache", "head", "hurt"], answer: "headache", explain: "headache = dor de cabeça." },
      { type: "match", pairs: [["headache", "dor de cabeça"], ["stomachache", "dor de barriga"], ["cold", "resfriado"], ["fever", "febre"]], explain: "Problemas de saúde." },
      { type: "fill", before: "I feel", after: ".", options: ["sick", "a sick", "sickness"], answer: "sick", explain: "feel + adjetivo." },
      { type: "choose", line: "How do you feel?", options: ["Not so good. I have a cold.", "I feel a cold.", "I am a headache."], answer: "Not so good. I have a cold.", explain: "have + problema de saúde." },
      { type: "build", pt: "Ele está com febre.", answer: "He has a fever", extra: ["is", "have"], explain: "Em inglês: \"tem\" febre → has a fever." },
      { type: "listen", audio: "What's wrong?", options: ["What's wrong?", "What's long?", "What's on?"], answer: "What's wrong?", explain: "What's wrong? = O que houve?" },
      { type: "match", pairs: [["terrible", "péssimo"], ["great", "ótimo"], ["tired", "cansado"], ["better", "melhor"]], explain: "Como você se sente." },
      { type: "fill", before: "She", after: "a sore throat.", options: ["has", "have", "is"], answer: "has", explain: "she + has; sore throat = dor de garganta." },
    ],
  },
  {
    title: "Conselhos e remédios",
    activities: [
      { type: "fill", before: "", after: "some water. (beba)", options: ["Drink", "Drinks", "Drinking"], answer: "Drink", explain: "Imperativo: verbo na forma base." },
      { type: "fill", before: "", after: "go to work today. (não vá)", options: ["Don't", "Not", "No"], answer: "Don't", explain: "Imperativo negativo: Don't + verbo." },
      { type: "choose", line: "I have a headache.", options: ["Take some aspirin.", "Takes some aspirin.", "You taking aspirin."], answer: "Take some aspirin.", explain: "Conselho com imperativo." },
      { type: "build", pt: "Descanse e beba chá.", answer: "Rest and drink tea", extra: ["drinks", "rests"], explain: "Imperativo: Rest; drink." },
      { type: "match", pairs: [["medicine", "remédio"], ["cough drops", "pastilhas"], ["eye drops", "colírio"], ["pharmacy", "farmácia"]], explain: "Remédios comuns." },
      { type: "listen", audio: "Don't eat junk food.", options: ["Don't eat junk food.", "Don't eat any food.", "Do eat junk food."], answer: "Don't eat junk food.", explain: "Don't = não (imperativo)." },
      { type: "build", pt: "Vá ao médico.", answer: "See a doctor", extra: ["sees", "an"], explain: "see a doctor = consultar um médico." },
      { type: "write", prompt: "remédio", answer: ["medicine"], explain: "remédio = medicine." },
    ],
  },
];

export const unit13: Lesson[] = [
  {
    title: "Lojas e lugares",
    activities: [
      { type: "match", pairs: [["bank", "banco"], ["pharmacy", "farmácia"], ["bookstore", "livraria"], ["supermarket", "supermercado"]], explain: "Lugares da cidade." },
      { type: "match", pairs: [["post office", "correio"], ["gas station", "posto de gasolina"], ["museum", "museu"], ["park", "parque"]], explain: "Mais lugares." },
      { type: "choose", line: "Where can you buy books?", options: ["At a bookstore.", "At a gas station.", "At a bank."], answer: "At a bookstore.", explain: "bookstore = livraria." },
      { type: "fill", before: "You can buy medicine at a", after: ".", options: ["pharmacy", "museum", "park"], answer: "pharmacy", explain: "pharmacy = farmácia." },
      { type: "listen", audio: "Is there a bank near here?", options: ["Is there a bank near here?", "Is there a park near here?", "Is the bank near here?"], answer: "Is there a bank near here?", explain: "near here = perto daqui." },
      { type: "build", pt: "Há um supermercado perto daqui?", answer: "Is there a supermarket near here", extra: ["are", "an"], explain: "Is there...? = Há...?" },
      { type: "write", prompt: "correio", answer: ["post office"], explain: "correio = post office." },
      { type: "choose", line: "Where can you see paintings?", options: ["At a museum.", "At a pharmacy.", "At a post office."], answer: "At a museum.", explain: "museum = museu." },
    ],
  },
  {
    title: "Onde fica?",
    activities: [
      { type: "fill", before: "The bank is", after: "the pharmacy and the park.", options: ["between", "next", "across"], answer: "between", explain: "between = entre (dois lugares)." },
      { type: "fill", before: "The café is", after: "to the bookstore.", options: ["next", "near to", "between"], answer: "next", explain: "next to = ao lado de." },
      { type: "fill", before: "The museum is across", after: "the park.", options: ["from", "to", "of"], answer: "from", explain: "across from = em frente a (do outro lado)." },
      { type: "fill", before: "It's on the", after: "of Main Street and 2nd Avenue.", options: ["corner", "between", "next"], answer: "corner", explain: "on the corner of = na esquina de." },
      { type: "match", pairs: [["between", "entre"], ["next to", "ao lado de"], ["across from", "em frente a"], ["on the corner of", "na esquina de"]], explain: "Preposições de lugar." },
      { type: "listen", audio: "It's across from the bank.", options: ["It's across from the bank.", "It's next to the bank.", "It's behind the bank."], answer: "It's across from the bank.", explain: "across from = em frente a." },
      { type: "build", pt: "A farmácia fica na Rua Oak.", answer: "The pharmacy is on Oak Street", extra: ["in", "at"], explain: "Nome de rua: on." },
      { type: "choose", line: "Where's the park?", options: ["It's next to the museum.", "It's next the museum.", "It's between the museum."], answer: "It's next to the museum.", explain: "next to (com \"to\")." },
    ],
  },
  {
    title: "Direções",
    activities: [
      { type: "match", pairs: [["turn left", "vire à esquerda"], ["turn right", "vire à direita"], ["go straight", "siga em frente"], ["block", "quarteirão"]], explain: "Direções." },
      { type: "fill", before: "", after: "left on Pine Street.", options: ["Turn", "Turns", "Turning"], answer: "Turn", explain: "Imperativo: Turn." },
      { type: "fill", before: "Walk up Main Street for two", after: ".", options: ["blocks", "block", "corners"], answer: "blocks", explain: "two blocks = dois quarteirões." },
      { type: "choose", line: "How do I get to the museum?", options: ["Go straight and turn right.", "You going straight.", "It's a museum."], answer: "Go straight and turn right.", explain: "Direções com imperativo." },
      { type: "build", pt: "Siga em frente e vire à esquerda.", answer: "Go straight and turn left", extra: ["goes", "right"], explain: "Imperativos: Go; turn." },
      { type: "listen", audio: "It's on your right.", options: ["It's on your right.", "It's on your left.", "It's all right."], answer: "It's on your right.", explain: "on your right = à sua direita." },
      { type: "build", pt: "Como eu chego ao banco?", answer: "How do I get to the bank", extra: ["does", "at"], explain: "How do I get to...?" },
      { type: "write", prompt: "esquerda", answer: ["left"], explain: "esquerda = left." },
    ],
  },
];

export const unit14: Lesson[] = [
  {
    title: "Fim de semana: verbos regulares",
    activities: [
      { type: "write", prompt: "watch → passado", answer: ["watched"], explain: "Regular: + ed." },
      { type: "write", prompt: "study → passado", answer: ["studied"], explain: "Consoante + y → ied." },
      { type: "write", prompt: "stop → passado", answer: ["stopped"], explain: "Dobra a consoante: stopped." },
      { type: "fill", before: "I", after: "my apartment yesterday.", options: ["cleaned", "clean", "cleaning"], answer: "cleaned", explain: "yesterday → passado: cleaned." },
      { type: "build", pt: "Nós assistimos a um filme no sábado.", answer: "We watched a movie on Saturday", extra: ["watch", "in"], explain: "Passado regular: watched." },
      { type: "listen", audio: "She visited her grandmother.", options: ["She visited her grandmother.", "She visits her grandmother.", "She invited her grandmother."], answer: "She visited her grandmother.", explain: "visited = visitou." },
      { type: "match", pairs: [["yesterday", "ontem"], ["last night", "ontem à noite"], ["last weekend", "fim de semana passado"], ["chores", "tarefas de casa"]], explain: "Expressões de passado." },
      { type: "fill", before: "He", after: "until 10 p.m. last night.", options: ["worked", "works", "working"], answer: "worked", explain: "last night → passado." },
    ],
  },
  {
    title: "Verbos irregulares",
    activities: [
      { type: "match", pairs: [["go", "went"], ["have", "had"], ["see", "saw"], ["buy", "bought"]], explain: "Passado irregular." },
      { type: "match", pairs: [["eat", "ate"], ["get", "got"], ["make", "made"], ["do", "did"]], explain: "Mais verbos irregulares." },
      { type: "fill", before: "I", after: "to the beach last weekend.", options: ["went", "goed", "go"], answer: "went", explain: "go → went." },
      { type: "fill", before: "We", after: "a great time!", options: ["had", "haved", "have"], answer: "had", explain: "have → had." },
      { type: "build", pt: "Ela comprou sapatos novos.", answer: "She bought new shoes", extra: ["buyed", "buys"], explain: "buy → bought." },
      { type: "listen", audio: "I saw a great movie.", options: ["I saw a great movie.", "I see a great movie.", "I said a great movie."], answer: "I saw a great movie.", explain: "see → saw." },
      { type: "write", prompt: "eat → passado", answer: ["ate"], explain: "eat → ate." },
      { type: "build", pt: "Eu fiz o jantar ontem.", answer: "I made dinner yesterday", extra: ["maked", "did"], explain: "make (preparar) → made." },
    ],
  },
  {
    title: "Você se divertiu?",
    activities: [
      { type: "fill", before: "", after: "you have fun?", options: ["Did", "Do", "Were"], answer: "Did", explain: "Pergunta no passado: Did + verbo base." },
      { type: "fill", before: "Did you", after: "to the party?", options: ["go", "went", "goes"], answer: "go", explain: "Depois de did, verbo na forma base." },
      { type: "choose", line: "Did you go out last night?", options: ["No, I didn't. I stayed home.", "No, I don't.", "No, I didn't went."], answer: "No, I didn't. I stayed home.", explain: "Did → didn't." },
      { type: "choose", line: "Did she enjoy her vacation?", options: ["Yes, she did.", "Yes, she enjoyed.", "Yes, she was."], answer: "Yes, she did.", explain: "Resposta curta: did." },
      { type: "build", pt: "O que você fez no fim de semana?", answer: "What did you do last weekend", extra: ["doing", "does"], explain: "What + did + you + do?" },
      { type: "listen", audio: "We didn't go to the beach.", options: ["We didn't go to the beach.", "We did go to the beach.", "We don't go to the beach."], answer: "We didn't go to the beach.", explain: "didn't + verbo base." },
      { type: "match", pairs: [["vacation", "férias"], ["beach", "praia"], ["trip", "viagem"], ["stay home", "ficar em casa"]], explain: "Lazer e férias." },
      { type: "build", pt: "Eu não trabalhei no domingo.", answer: "I didn't work on Sunday", extra: ["worked", "don't"], explain: "didn't + verbo base (work)." },
    ],
  },
];

export const unit15: Lesson[] = [
  {
    title: "Onde você nasceu?",
    activities: [
      { type: "fill", context: "A: Where were you born?", before: "B: I was", after: "in Fortaleza.", options: ["born", "borned", "birth"], answer: "born", explain: "I was born = eu nasci." },
      { type: "fill", before: "They", after: "born in Japan.", options: ["were", "was", "are"], answer: "were", explain: "they + were." },
      { type: "choose", line: "When were you born?", options: ["I was born in 1995.", "I born in 1995.", "I were born in 1995."], answer: "I was born in 1995.", explain: "I + was born." },
      { type: "write", prompt: "1990 (ano)", answer: ["nineteen ninety"], explain: "Anos são lidos em pares: nineteen ninety." },
      { type: "write", prompt: "2015 (ano)", answer: ["twenty fifteen", "two thousand fifteen", "two thousand and fifteen"], explain: "2015 = twenty fifteen." },
      { type: "listen", audio: "She was born in two thousand eight.", options: ["She was born in two thousand eight.", "She was born in two thousand eighteen.", "She is born in two thousand eight."], answer: "She was born in two thousand eight.", explain: "2008 = two thousand eight." },
      { type: "build", pt: "Onde seus pais nasceram?", answer: "Where were your parents born", extra: ["was", "did"], explain: "parents (plural) → were." },
      { type: "fill", before: "My father", after: "born in Recife.", options: ["was", "were", "is"], answer: "was", explain: "he → was." },
    ],
  },
  {
    title: "Passado do verbo be",
    activities: [
      { type: "fill", before: "I", after: "at home last night.", options: ["was", "were", "am"], answer: "was", explain: "I + was." },
      { type: "fill", before: "We", after: "tired yesterday.", options: ["were", "was", "are"], answer: "were", explain: "we + were." },
      { type: "fill", before: "The test", after: "easy. It was difficult.", options: ["wasn't", "weren't", "didn't"], answer: "wasn't", explain: "Negativo: wasn't." },
      { type: "choose", line: "Were you at work on Monday?", options: ["Yes, I was.", "Yes, I were.", "Yes, I did."], answer: "Yes, I was.", explain: "Were you → I was." },
      { type: "build", pt: "O filme foi ótimo.", answer: "The movie was great", extra: ["were", "is"], explain: "movie (singular) → was." },
      { type: "listen", audio: "They weren't at the party.", options: ["They weren't at the party.", "They were at the party.", "They aren't at the party."], answer: "They weren't at the party.", explain: "weren't = were not." },
      { type: "match", pairs: [["I was", "eu estava"], ["we were", "nós estávamos"], ["it wasn't", "não era"], ["they weren't", "eles não estavam"]], explain: "was = I/he/she/it; were = you/we/they." },
      { type: "fill", before: "How", after: "your weekend?", options: ["was", "were", "did"], answer: "was", explain: "weekend (singular) → was." },
    ],
  },
  {
    title: "Tempos de escola",
    activities: [
      { type: "match", pairs: [["school", "escola"], ["grade", "série/nota"], ["subject", "matéria"], ["graduate", "formar-se"]], explain: "Vida escolar." },
      { type: "fill", before: "What", after: "your favorite subject?", options: ["was", "were", "did"], answer: "was", explain: "subject (singular) → was." },
      { type: "fill", before: "When did you", after: "from high school?", options: ["graduate", "graduated", "graduates"], answer: "graduate", explain: "did + verbo base." },
      { type: "choose", line: "Where did you grow up?", options: ["I grew up in Ceará.", "I growed up in Ceará.", "I was grow up in Ceará."], answer: "I grew up in Ceará.", explain: "grow → grew (irregular)." },
      { type: "build", pt: "Meu professor favorito era muito gentil.", answer: "My favorite teacher was very kind", extra: ["were", "is"], explain: "teacher (singular) → was." },
      { type: "listen", audio: "Math was my favorite subject.", options: ["Math was my favorite subject.", "Math is my favorite subject.", "Art was my favorite subject."], answer: "Math was my favorite subject.", explain: "Math = matemática." },
      { type: "build", pt: "Como era a sua escola?", answer: "What was your school like", extra: ["were", "how"], explain: "What was ... like? = Como era...?" },
      { type: "write", prompt: "matéria (escolar)", answer: ["subject"], explain: "matéria = subject." },
    ],
  },
];

export const unit16: Lesson[] = [
  {
    title: "Onde as pessoas estão",
    activities: [
      { type: "fill", before: "She's", after: "work right now.", options: ["at", "in", "on"], answer: "at", explain: "at work = no trabalho." },
      { type: "fill", before: "He's", after: "vacation this week.", options: ["on", "in", "at"], answer: "on", explain: "on vacation = de férias." },
      { type: "fill", before: "They're", after: "the hospital.", options: ["in", "on", "to"], answer: "in", explain: "in the hospital = no hospital." },
      { type: "match", pairs: [["at home", "em casa"], ["at work", "no trabalho"], ["on vacation", "de férias"], ["in bed", "na cama"]], explain: "Onde as pessoas estão." },
      { type: "choose", line: "Is Carla there?", options: ["No, she's at the gym.", "No, she's on the gym.", "No, she gyms."], answer: "No, she's at the gym.", explain: "at the gym = na academia." },
      { type: "listen", audio: "He's out of town.", options: ["He's out of town.", "He's out of time.", "He's in town."], answer: "He's out of town.", explain: "out of town = viajando/fora da cidade." },
      { type: "build", pt: "Minha irmã está no shopping.", answer: "My sister is at the mall", extra: ["on", "are"], explain: "at the mall = no shopping." },
      { type: "write", prompt: "em casa", answer: ["at home"], explain: "em casa = at home." },
    ],
  },
  {
    title: "Ao telefone",
    activities: [
      { type: "choose", line: "Hello. May I speak to Ana, please?", options: ["I'm sorry, she's not here.", "Yes, I'm speak.", "Goodbye."], answer: "I'm sorry, she's not here.", explain: "Resposta educada ao telefone." },
      { type: "fill", before: "Can I take a", after: "?", options: ["message", "massage", "call"], answer: "message", explain: "take a message = anotar um recado." },
      { type: "fill", before: "Please ask her to call", after: "back.", options: ["me", "I", "my"], answer: "me", explain: "Pronome objeto: me." },
      { type: "match", pairs: [["I", "me"], ["he", "him"], ["she", "her"], ["they", "them"]], explain: "Pronomes sujeito → objeto." },
      { type: "build", pt: "Por favor, ligue para ele mais tarde.", answer: "Please call him later", extra: ["he", "his"], explain: "Depois do verbo: him." },
      { type: "listen", audio: "Can I leave a message?", options: ["Can I leave a message?", "Can I take a message?", "Can I live a message?"], answer: "Can I leave a message?", explain: "leave a message = deixar recado." },
      { type: "fill", before: "I can't hear", after: ". (eles)", options: ["them", "they", "their"], answer: "them", explain: "they → them." },
      { type: "write", prompt: "recado", answer: ["message"], explain: "recado = message." },
    ],
  },
  {
    title: "Convites e desculpas",
    activities: [
      { type: "fill", before: "Would you like", after: "see a movie?", options: ["to", "for", "at"], answer: "to", explain: "Would you like to + verbo." },
      { type: "choose", line: "Do you want to go to a concert tonight?", options: ["Sure, I'd love to!", "Sure, I'd love.", "Yes, I want go."], answer: "Sure, I'd love to!", explain: "Aceitar: I'd love to." },
      { type: "choose", line: "Would you like to have dinner on Friday?", options: ["Sorry, I can't. I have to work.", "Sorry, I don't can.", "No, I wouldn't like."], answer: "Sorry, I can't. I have to work.", explain: "Recusar + desculpa." },
      { type: "match", pairs: [["I'd love to", "eu adoraria"], ["I have to", "eu tenho que"], ["I need to", "eu preciso"], ["I want to", "eu quero"]], explain: "Verbo + to." },
      { type: "build", pt: "Você quer jogar futebol amanhã?", answer: "Do you want to play soccer tomorrow", extra: ["does", "for"], explain: "Do you want to + verbo?" },
      { type: "listen", audio: "I'm sorry, I have to study.", options: ["I'm sorry, I have to study.", "I'm sorry, I have to work.", "I'm sorry, I want to study."], answer: "I'm sorry, I have to study.", explain: "have to = ter que." },
      { type: "build", pt: "Eu preciso visitar meus pais.", answer: "I need to visit my parents", extra: ["visits", "for"], explain: "need to + verbo." },
      { type: "fill", before: "Maybe next", after: "!", options: ["time", "times", "hour"], answer: "time", explain: "Maybe next time = fica para a próxima." },
    ],
  },
];
