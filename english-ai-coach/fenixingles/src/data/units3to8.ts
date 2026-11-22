// Unidades 3 a 8 do FenixInglês (ordem do livro-base; conteúdo original).
import type { Lesson } from "./units";

export const unit3: Lesson[] = [
  {
    title: "Países e cidades",
    activities: [
      { type: "match", pairs: [["country", "país"], ["city", "cidade"], ["language", "idioma"], ["from", "de (origem)"]], explain: "Vocabulário de origem." },
      { type: "fill", context: "A: Where are you from?", before: "B: I'm", after: "Brazil.", options: ["from", "in", "on"], answer: "from", explain: "\"I'm from...\" = \"Eu sou de...\"." },
      { type: "choose", line: "Where are you from?", options: ["I'm from Fortaleza.", "I'm fine.", "It's on the desk."], answer: "I'm from Fortaleza.", explain: "A pergunta é sobre origem." },
      { type: "listen", audio: "Is Portuguese your first language?", options: ["Is Portuguese your first language?", "Is Brazil your country?", "Is this your city?"], answer: "Is Portuguese your first language?", explain: "\"first language\" = língua materna." },
      { type: "fill", before: "She", after: "from Canada.", options: ["is", "are", "am"], answer: "is", explain: "she + is." },
      { type: "build", pt: "Nós somos do Brasil.", answer: "We are from Brazil", extra: ["is", "in"], explain: "we + are + from." },
      { type: "choose", line: "Are you from Recife?", options: ["No, I'm not. I'm from Natal.", "No, I amn't.", "Yes, I'm."], answer: "No, I'm not. I'm from Natal.", explain: "Resposta curta negativa: No, I'm not." },
      { type: "match", pairs: [["Brazil", "Brasil"], ["Brazilian", "brasileiro"], ["Japan", "Japão"], ["Japanese", "japonês"]], explain: "País x nacionalidade." },
    ],
  },
  {
    title: "Verbo be: negativo e perguntas",
    activities: [
      { type: "fill", before: "I", after: "a teacher. I'm a student.", options: ["am not", "is not", "not am"], answer: "am not", explain: "Negativo: I am not (I'm not)." },
      { type: "fill", before: "They", after: "from Chile. They're from Peru.", options: ["aren't", "isn't", "amn't"], answer: "aren't", explain: "they + are not = aren't." },
      { type: "choose", line: "Is he from Mexico?", options: ["Yes, he is.", "Yes, he's.", "Yes, he are."], answer: "Yes, he is.", explain: "Resposta curta afirmativa não usa contração." },
      { type: "build", pt: "Ela não é tímida.", answer: "She isn't shy", extra: ["aren't", "is"], explain: "she + isn't." },
      { type: "build", pt: "Você é do Canadá?", answer: "Are you from Canada", extra: ["is", "do"], explain: "Pergunta: inverta o verbo be: Are you...?" },
      { type: "listen", audio: "We aren't from Japan.", options: ["We aren't from Japan.", "We are from Japan.", "He isn't from Japan."], answer: "We aren't from Japan.", explain: "aren't = are not." },
      { type: "fill", before: "", after: "your parents from Ceará?", options: ["Are", "Is", "Am"], answer: "Are", explain: "parents é plural → Are." },
      { type: "write", prompt: "is not →", answer: ["isn't"], explain: "is not = isn't." },
    ],
  },
  {
    title: "Idade e aparência",
    activities: [
      { type: "write", prompt: "15", answer: ["fifteen"], explain: "15 = fifteen." },
      { type: "write", prompt: "40", answer: ["forty"], explain: "40 = forty (sem \"u\")." },
      { type: "listen", audio: "thirteen", options: ["thirteen", "thirty", "three"], answer: "thirteen", explain: "13 = thirteen; 30 = thirty." },
      { type: "fill", context: "A: How old are you?", before: "B: I'm twenty-five", after: "old.", options: ["years", "year", "ages"], answer: "years", explain: "\"I'm ... years old\" = tenho ... anos." },
      { type: "match", pairs: [["tall", "alto"], ["short", "baixo"], ["friendly", "simpático"], ["shy", "tímido"]], explain: "Adjetivos de aparência e personalidade." },
      { type: "choose", line: "What's your brother like?", options: ["He's tall and friendly.", "He's from Brazil.", "He's twenty."], answer: "He's tall and friendly.", explain: "\"What's ... like?\" pede uma descrição." },
      { type: "build", pt: "Minha irmã é muito engraçada.", answer: "My sister is very funny", extra: ["are", "her"], explain: "funny = engraçado; very = muito." },
      { type: "write", prompt: "21", answer: ["twenty-one", "twenty one"], explain: "21 = twenty-one." },
    ],
  },
];

export const unit4: Lesson[] = [
  {
    title: "Roupas e cores",
    activities: [
      { type: "match", pairs: [["coat", "casaco"], ["shirt", "camisa"], ["shoes", "sapatos"], ["dress", "vestido"]], explain: "Peças de roupa." },
      { type: "match", pairs: [["red", "vermelho"], ["blue", "azul"], ["black", "preto"], ["white", "branco"]], explain: "Cores." },
      { type: "build", pt: "Eu tenho um casaco preto.", answer: "I have a black coat", extra: ["an", "coats"], explain: "Em inglês o adjetivo vem antes: a black coat." },
      { type: "fill", before: "Her shoes", after: "brown.", options: ["are", "is", "am"], answer: "are", explain: "shoes é plural → are." },
      { type: "listen", audio: "a green dress", options: ["a green dress", "a gray dress", "a green shirt"], answer: "a green dress", explain: "green = verde." },
      { type: "choose", line: "What color is your bag?", options: ["It's yellow.", "It's a bag.", "They're yellow."], answer: "It's yellow.", explain: "Uma bolsa → It's + cor." },
      { type: "write", prompt: "azul", answer: ["blue"], explain: "azul = blue." },
      { type: "build", pt: "Ele usa camisas brancas.", answer: "He wears white shirts", extra: ["wear", "whites"], explain: "Adjetivo não vai para o plural: white shirts." },
    ],
  },
  {
    title: "De quem é?",
    activities: [
      { type: "fill", context: "A: Whose coat is this?", before: "B: It's", after: ".", options: ["mine", "my", "me"], answer: "mine", explain: "Sem substantivo depois, use o pronome possessivo: mine." },
      { type: "match", pairs: [["mine", "meu (o meu)"], ["yours", "seu (o seu)"], ["ours", "nosso"], ["theirs", "deles"]], explain: "Pronomes possessivos." },
      { type: "choose", line: "Is this umbrella yours?", options: ["No, it's not mine.", "No, it's not my.", "No, they're mine."], answer: "No, it's not mine.", explain: "mine substitui \"my umbrella\"." },
      { type: "fill", before: "This is", after: "car. It's our car.", options: ["our", "ours", "us"], answer: "our", explain: "Antes do substantivo: our car." },
      { type: "build", pt: "De quem são estes sapatos?", answer: "Whose shoes are these", extra: ["who", "is"], explain: "Whose = de quem." },
      { type: "fill", before: "The shoes are", after: ". (deles)", options: ["theirs", "their", "they"], answer: "theirs", explain: "Sem substantivo depois: theirs." },
      { type: "listen", audio: "Whose bag is this?", options: ["Whose bag is this?", "Who's bag is this?", "Where's my bag?"], answer: "Whose bag is this?", explain: "Whose (de quem) soa igual a who's (who is)." },
      { type: "choose", line: "Is this Ana's dress?", options: ["Yes, it's hers.", "Yes, it's her.", "Yes, it's his."], answer: "Yes, it's hers.", explain: "Ana é mulher → hers." },
    ],
  },
  {
    title: "Clima e o que estou vestindo",
    activities: [
      { type: "match", pairs: [["sunny", "ensolarado"], ["rainy", "chuvoso"], ["cold", "frio"], ["hot", "quente"]], explain: "Clima." },
      { type: "match", pairs: [["winter", "inverno"], ["summer", "verão"], ["spring", "primavera"], ["fall", "outono"]], explain: "Estações do ano." },
      { type: "fill", before: "I'm", after: "a T-shirt today.", options: ["wearing", "wear", "wears"], answer: "wearing", explain: "Agora: present continuous (am + -ing)." },
      { type: "fill", before: "It's cold,", after: "I'm wearing a coat.", options: ["so", "but", "and not"], answer: "so", explain: "so = então (consequência)." },
      { type: "fill", before: "It's sunny,", after: "it's cold.", options: ["but", "so", "because"], answer: "but", explain: "but = mas (contraste)." },
      { type: "choose", line: "Are you wearing a jacket?", options: ["No, I'm not.", "No, I don't.", "No, I amn't."], answer: "No, I'm not.", explain: "Resposta curta do present continuous: I'm not." },
      { type: "listen", audio: "It's raining today.", options: ["It's raining today.", "It's sunny today.", "It's snowing today."], answer: "It's raining today.", explain: "raining = chovendo." },
      { type: "build", pt: "Eles estão usando jeans azul.", answer: "They are wearing blue jeans", extra: ["is", "wear"], explain: "they + are + wearing." },
    ],
  },
];

export const unit5: Lesson[] = [
  {
    title: "Que horas são?",
    activities: [
      { type: "fill", context: "A: What time is it?", before: "B: It's five", after: ".", options: ["o'clock", "hours", "time"], answer: "o'clock", explain: "Hora cheia: o'clock." },
      { type: "match", pairs: [["noon", "meio-dia"], ["midnight", "meia-noite"], ["a.m.", "da manhã"], ["p.m.", "da tarde/noite"]], explain: "Expressões de horário." },
      { type: "listen", audio: "It's seven thirty.", options: ["It's seven thirty.", "It's seven thirteen.", "It's eleven thirty."], answer: "It's seven thirty.", explain: "7:30 = seven thirty." },
      { type: "choose", line: "Qual é a forma de dizer 6:15?", options: ["six fifteen", "six fifty", "sixteen"], answer: "six fifteen", explain: "Diga a hora e depois os minutos: six fifteen." },
      { type: "write", prompt: "meia-noite", answer: ["midnight"], explain: "midnight = meia-noite." },
      { type: "build", pt: "São dez horas da noite.", answer: "It's ten at night", extra: ["in", "on"], explain: "\"at night\" = à noite." },
      { type: "fill", before: "It's 9:00", after: "the morning.", options: ["in", "at", "on"], answer: "in", explain: "in the morning / afternoon / evening." },
      { type: "listen", audio: "It's noon.", options: ["It's noon.", "It's now.", "It's nine."], answer: "It's noon.", explain: "noon = meio-dia." },
    ],
  },
  {
    title: "O que você está fazendo?",
    activities: [
      { type: "fill", before: "I'm", after: "dinner now.", options: ["cooking", "cook", "cooks"], answer: "cooking", explain: "Agora: am + verbo-ing." },
      { type: "fill", context: "A: What are you doing?", before: "B: I'm", after: "TV.", options: ["watching", "watch", "watches"], answer: "watching", explain: "watching TV = assistindo TV." },
      { type: "match", pairs: [["sleep", "dormir"], ["cook", "cozinhar"], ["study", "estudar"], ["work", "trabalhar"]], explain: "Atividades do dia a dia." },
      { type: "choose", line: "What is Leo doing?", options: ["He's sleeping.", "He sleeps.", "He's sleep."], answer: "He's sleeping.", explain: "is + sleeping." },
      { type: "build", pt: "O que ela está fazendo?", answer: "What is she doing", extra: ["does", "do"], explain: "What + is + she + doing?" },
      { type: "listen", audio: "We're having lunch.", options: ["We're having lunch.", "We have lunch.", "We're having dinner."], answer: "We're having lunch.", explain: "lunch = almoço." },
      { type: "write", prompt: "run + ing", answer: ["running"], explain: "run → running (dobra o n)." },
      { type: "build", pt: "Eles estão estudando inglês.", answer: "They are studying English", extra: ["is", "study"], explain: "they + are + studying." },
    ],
  },
  {
    title: "Rotina do dia",
    activities: [
      { type: "match", pairs: [["morning", "manhã"], ["afternoon", "tarde"], ["evening", "noite (início)"], ["night", "noite"]], explain: "Períodos do dia." },
      { type: "fill", before: "I study", after: "the evening.", options: ["in", "at", "on"], answer: "in", explain: "in the evening." },
      { type: "fill", before: "The class is", after: "8:00.", options: ["at", "in", "on"], answer: "at", explain: "Horário exato: at." },
      { type: "choose", line: "What time is your class?", options: ["It's at seven.", "It's in seven.", "It's seven o'clocks."], answer: "It's at seven.", explain: "at + horário." },
      { type: "listen", audio: "I'm at work in the afternoon.", options: ["I'm at work in the afternoon.", "I'm at home in the afternoon.", "I'm at work in the morning."], answer: "I'm at work in the afternoon.", explain: "at work = no trabalho." },
      { type: "build", pt: "Eu estou em casa à noite.", answer: "I'm at home at night", extra: ["in", "on"], explain: "at home; at night." },
      { type: "write", prompt: "4:45", answer: ["four forty-five", "four forty five"], explain: "4:45 = four forty-five." },
      { type: "choose", line: "Is it 10 p.m.?", options: ["Yes, it's ten at night.", "Yes, it's ten in the morning.", "Yes, it's noon."], answer: "Yes, it's ten at night.", explain: "p.m. depois das 18h = at night." },
    ],
  },
];

export const unit6: Lesson[] = [
  {
    title: "Como você vai?",
    activities: [
      { type: "match", pairs: [["bus", "ônibus"], ["bike", "bicicleta"], ["car", "carro"], ["train", "trem"]], explain: "Meios de transporte." },
      { type: "fill", before: "I", after: "the bus to work.", options: ["take", "takes", "taking"], answer: "take", explain: "Rotina: present simple. I take." },
      { type: "fill", before: "She", after: "her bike to school.", options: ["rides", "ride", "riding"], answer: "rides", explain: "he/she/it + -s: rides." },
      { type: "choose", line: "How do you go to work?", options: ["I walk.", "I'm walk.", "I walking."], answer: "I walk.", explain: "Present simple: I walk." },
      { type: "build", pt: "Eu dirijo para o trabalho.", answer: "I drive to work", extra: ["drives", "go"], explain: "drive = dirigir." },
      { type: "listen", audio: "He takes the train.", options: ["He takes the train.", "He take the train.", "He takes the bus."], answer: "He takes the train.", explain: "he + takes." },
      { type: "write", prompt: "ônibus", answer: ["bus"], explain: "ônibus = bus." },
      { type: "fill", before: "", after: "you walk to school?", options: ["Do", "Does", "Are"], answer: "Do", explain: "Pergunta com you: Do." },
    ],
  },
  {
    title: "Família",
    activities: [
      { type: "match", pairs: [["mother", "mãe"], ["father", "pai"], ["brother", "irmão"], ["sister", "irmã"]], explain: "Família." },
      { type: "match", pairs: [["parents", "pais"], ["children", "filhos"], ["husband", "marido"], ["wife", "esposa"]], explain: "Mais família." },
      { type: "fill", before: "My father", after: "in a bank.", options: ["works", "work", "working"], answer: "works", explain: "my father = he → works." },
      { type: "fill", before: "", after: "your sister live in Fortaleza?", options: ["Does", "Do", "Is"], answer: "Does", explain: "he/she → Does." },
      { type: "choose", line: "Does your brother drive?", options: ["No, he doesn't.", "No, he don't.", "No, he isn't."], answer: "No, he doesn't.", explain: "Does → doesn't." },
      { type: "build", pt: "Minha mãe não trabalha aos domingos.", answer: "My mother doesn't work on Sundays", extra: ["don't", "works"], explain: "doesn't + verbo sem -s." },
      { type: "listen", audio: "My parents live near here.", options: ["My parents live near here.", "My parent lives near here.", "My parents leave here."], answer: "My parents live near here.", explain: "live = morar." },
      { type: "write", prompt: "irmã", answer: ["sister"], explain: "irmã = sister." },
    ],
  },
  {
    title: "Dias da semana e rotina",
    activities: [
      { type: "match", pairs: [["Monday", "segunda"], ["Wednesday", "quarta"], ["Friday", "sexta"], ["Sunday", "domingo"]], explain: "Dias da semana." },
      { type: "fill", before: "I don't work", after: "weekends.", options: ["on", "in", "at"], answer: "on", explain: "on weekends / on Sundays." },
      { type: "fill", before: "She gets up", after: "every day.", options: ["early", "earlies", "in early"], answer: "early", explain: "early = cedo." },
      { type: "choose", line: "What time do you get up?", options: ["At six thirty.", "On Monday.", "Yes, I do."], answer: "At six thirty.", explain: "What time → horário." },
      { type: "build", pt: "Eu estudo inglês todo dia.", answer: "I study English every day", extra: ["studies", "all"], explain: "every day = todo dia." },
      { type: "listen", audio: "He goes to bed late.", options: ["He goes to bed late.", "He goes to bed early.", "He go to bed late."], answer: "He goes to bed late.", explain: "go → goes; late = tarde." },
      { type: "write", prompt: "sábado", answer: ["saturday"], explain: "sábado = Saturday (sempre com maiúscula)." },
      { type: "write", prompt: "he + have", answer: ["has"], explain: "Irregular: he has." },
    ],
  },
];

export const unit7: Lesson[] = [
  {
    title: "Casas e cômodos",
    activities: [
      { type: "match", pairs: [["kitchen", "cozinha"], ["bedroom", "quarto"], ["bathroom", "banheiro"], ["living room", "sala"]], explain: "Cômodos." },
      { type: "fill", context: "A: Does your apartment have a view?", before: "B: Yes, it", after: ".", options: ["does", "has", "is"], answer: "does", explain: "Does → does." },
      { type: "choose", line: "Do you live in a house?", options: ["No, I don't. I live in an apartment.", "No, I'm not.", "No, I doesn't."], answer: "No, I don't. I live in an apartment.", explain: "Do → don't." },
      { type: "build", pt: "Minha casa tem três quartos.", answer: "My house has three bedrooms", extra: ["have", "bedroom"], explain: "it/house → has." },
      { type: "listen", audio: "The kitchen is small.", options: ["The kitchen is small.", "The kitchen is tall.", "The bedroom is small."], answer: "The kitchen is small.", explain: "small = pequeno." },
      { type: "write", prompt: "banheiro", answer: ["bathroom"], explain: "banheiro = bathroom." },
      { type: "fill", before: "", after: "your house have a yard?", options: ["Does", "Do", "Is"], answer: "Does", explain: "house = it → Does." },
      { type: "match", pairs: [["view", "vista"], ["window", "janela"], ["yard", "quintal"], ["elevator", "elevador"]], explain: "Partes da casa." },
    ],
  },
  {
    title: "There is / There are",
    activities: [
      { type: "fill", before: "", after: "a sofa in the living room.", options: ["There's", "There are", "It's"], answer: "There's", explain: "Singular: there is (there's)." },
      { type: "fill", before: "There", after: "two windows.", options: ["are", "is", "be"], answer: "are", explain: "Plural: there are." },
      { type: "fill", before: "There", after: "any chairs.", options: ["aren't", "isn't", "don't"], answer: "aren't", explain: "Negativo plural: there aren't any." },
      { type: "choose", line: "Is there an elevator?", options: ["No, there isn't.", "No, it doesn't.", "No, there aren't."], answer: "No, there isn't.", explain: "Is there → there isn't." },
      { type: "build", pt: "Não há um elevador.", answer: "There isn't an elevator", extra: ["aren't", "a"], explain: "elevator começa com vogal → an." },
      { type: "listen", audio: "There are no curtains.", options: ["There are no curtains.", "There are two curtains.", "There's no curtain."], answer: "There are no curtains.", explain: "there are no = não há nenhum." },
      { type: "build", pt: "Há um tapete no quarto?", answer: "Is there a rug in the bedroom", extra: ["are", "it"], explain: "Pergunta: Is there...?" },
      { type: "choose", line: "Are there any lamps?", options: ["Yes, there are.", "Yes, there is.", "Yes, they do."], answer: "Yes, there are.", explain: "Are there → there are." },
    ],
  },
  {
    title: "Móveis",
    activities: [
      { type: "match", pairs: [["sofa", "sofá"], ["bed", "cama"], ["table", "mesa"], ["lamp", "luminária"]], explain: "Móveis." },
      { type: "match", pairs: [["mirror", "espelho"], ["rug", "tapete"], ["curtains", "cortinas"], ["dresser", "cômoda"]], explain: "Mais móveis." },
      { type: "fill", before: "We need", after: "chairs for the kitchen.", options: ["some", "a", "an"], answer: "some", explain: "Plural afirmativo: some." },
      { type: "fill", before: "We don't have", after: "lamps.", options: ["any", "some", "a"], answer: "any", explain: "Negativo: any." },
      { type: "listen", audio: "There's a mirror in the bathroom.", options: ["There's a mirror in the bathroom.", "There's a mirror in the bedroom.", "There are mirrors in the bathroom."], answer: "There's a mirror in the bathroom.", explain: "mirror = espelho." },
      { type: "build", pt: "Há um sofá azul na sala.", answer: "There's a blue sofa in the living room", extra: ["are", "an"], explain: "Adjetivo antes do substantivo." },
      { type: "write", prompt: "cama", answer: ["bed"], explain: "cama = bed." },
      { type: "choose", line: "What do you need for your bedroom?", options: ["I need a bed and a lamp.", "I need a stove.", "Yes, I need."], answer: "I need a bed and a lamp.", explain: "Móveis de quarto." },
    ],
  },
];

export const unit8: Lesson[] = [
  {
    title: "Profissões",
    activities: [
      { type: "match", pairs: [["teacher", "professor"], ["nurse", "enfermeiro"], ["doctor", "médico"], ["cashier", "caixa"]], explain: "Profissões." },
      { type: "match", pairs: [["chef", "chef de cozinha"], ["pilot", "piloto"], ["police officer", "policial"], ["salesperson", "vendedor"]], explain: "Mais profissões." },
      { type: "fill", before: "She's", after: "engineer.", options: ["an", "a", "the"], answer: "an", explain: "engineer começa com vogal → an." },
      { type: "fill", context: "A: What do you do?", before: "B: I'm", after: "nurse.", options: ["a", "an", "the"], answer: "a", explain: "Profissão: a/an + profissão." },
      { type: "choose", line: "What do you do?", options: ["I'm a teacher.", "I'm fine.", "I do homework."], answer: "I'm a teacher.", explain: "\"What do you do?\" pergunta a profissão." },
      { type: "listen", audio: "He's a police officer.", options: ["He's a police officer.", "He's a pilot.", "He's an office worker."], answer: "He's a police officer.", explain: "police officer = policial." },
      { type: "write", prompt: "médico", answer: ["doctor"], explain: "médico = doctor." },
      { type: "build", pt: "Meu pai é motorista de ônibus.", answer: "My father is a bus driver", extra: ["an", "drives"], explain: "bus driver = motorista de ônibus." },
    ],
  },
  {
    title: "Onde você trabalha?",
    activities: [
      { type: "fill", before: "Where", after: "you work?", options: ["do", "does", "are"], answer: "do", explain: "you → do." },
      { type: "fill", before: "Where", after: "she work?", options: ["does", "do", "is"], answer: "does", explain: "she → does." },
      { type: "choose", line: "Where does Ana work?", options: ["She works in a hospital.", "She work in a hospital.", "She's work in a hospital."], answer: "She works in a hospital.", explain: "she + works." },
      { type: "match", pairs: [["office", "escritório"], ["hospital", "hospital"], ["store", "loja"], ["restaurant", "restaurante"]], explain: "Locais de trabalho." },
      { type: "build", pt: "O que ele faz?", answer: "What does he do", extra: ["doing", "is"], explain: "What + does + he + do?" },
      { type: "listen", audio: "I work in an office downtown.", options: ["I work in an office downtown.", "I work in a store downtown.", "I walk to an office."], answer: "I work in an office downtown.", explain: "downtown = centro da cidade." },
      { type: "build", pt: "A que horas você começa?", answer: "What time do you start", extra: ["does", "starts"], explain: "What time + do + you + verbo." },
      { type: "write", prompt: "loja", answer: ["store", "shop"], explain: "loja = store (EUA) / shop." },
    ],
  },
  {
    title: "Opiniões sobre trabalho",
    activities: [
      { type: "match", pairs: [["interesting", "interessante"], ["boring", "chato"], ["easy", "fácil"], ["stressful", "estressante"]], explain: "Opiniões." },
      { type: "fill", before: "It's an", after: "job.", options: ["interesting", "boring", "easy"], answer: "interesting", explain: "\"an\" antes de vogal: an interesting job." },
      { type: "fill", before: "The job is", after: ".", options: ["boring", "a boring", "boringly"], answer: "boring", explain: "Depois de be o adjetivo fica sozinho." },
      { type: "choose", line: "Do you like your job?", options: ["Yes, I do. It's exciting.", "Yes, I like.", "Yes, I'm."], answer: "Yes, I do. It's exciting.", explain: "Do → do." },
      { type: "build", pt: "Um piloto tem um trabalho difícil.", answer: "A pilot has a difficult job", extra: ["have", "an"], explain: "Adjetivo antes do substantivo." },
      { type: "listen", audio: "Nurses have a stressful job.", options: ["Nurses have a stressful job.", "Nurses have an easy job.", "Nurses has a stressful job."], answer: "Nurses have a stressful job.", explain: "stressful = estressante." },
      { type: "choose", line: "Qual frase está correta?", options: ["She has a dangerous job.", "She has a job dangerous.", "She have a dangerous job."], answer: "She has a dangerous job.", explain: "she + has; adjetivo antes do substantivo." },
      { type: "write", prompt: "fácil", answer: ["easy"], explain: "fácil = easy." },
    ],
  },
];
