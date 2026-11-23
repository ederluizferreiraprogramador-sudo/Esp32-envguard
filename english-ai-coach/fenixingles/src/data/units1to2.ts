// Unidades 1 e 2 do FenixInglês (cópia do app no Lovable).
import type { Lesson } from "./units";

export const unit1: Lesson[] = [
  { title: "Olá e nomes", activities: [
    { type: "match", pairs: [["hello", "olá"], ["goodbye", "tchau"], ["good morning", "bom dia"], ["name", "nome"]], explain: "Cumprimentos básicos." },
    { type: "fill", context: "A: Hi, I'm Ana. What's your name?", before: "B: My", after: "is Leo.", options: ["name", "names", "nome"], answer: "name", explain: "\"My name is...\" = \"Meu nome é...\"." },
    { type: "choose", line: "What's your name?", options: ["My name is Leo.", "I'm fine, thanks.", "Goodbye!"], answer: "My name is Leo.", explain: "A pergunta é sobre o nome, então respondemos com o nome." },
    { type: "listen", audio: "Nice to meet you.", options: ["Nice to meet you.", "Nice to see you.", "Good morning."], answer: "Nice to meet you.", explain: "\"Nice to meet you\" = \"Prazer em conhecê-lo\"." },
    { type: "build", pt: "Meu nome é Ana.", answer: "My name is Ana", extra: ["your", "are"], explain: "Use \"my\" para \"meu/minha\"." },
    { type: "choose", line: "Nice to meet you.", options: ["Nice to meet you, too.", "My name is Ana.", "I'm ten."], answer: "Nice to meet you, too.", explain: "Respondemos com \"Nice to meet you, too\" (também)." },
    { type: "fill", before: "Good", after: "! How are you?", options: ["morning", "night", "name"], answer: "morning", explain: "\"Good morning\" = \"Bom dia\"." },
    { type: "build", pt: "Como você está?", answer: "How are you", extra: ["is", "what"], explain: "\"How are you?\" é a pergunta mais comum para cumprimentar." },
  ] },
  { title: "Verbo be e números", activities: [
    { type: "fill", before: "I", after: "Leo.", options: ["am", "is", "are"], answer: "am", explain: "Com \"I\" usamos \"am\": I am (I'm)." },
    { type: "fill", before: "She", after: "my friend.", options: ["is", "am", "are"], answer: "is", explain: "Com he/she/it usamos \"is\"." },
    { type: "write", prompt: "8", answer: ["eight"], explain: "8 = eight." },
    { type: "write", prompt: "3", answer: ["three"], explain: "3 = three." },
    { type: "match", pairs: [["one", "1"], ["five", "5"], ["seven", "7"], ["ten", "10"], ["zero", "0"]], explain: "Números de 0 a 10." },
    { type: "choose", line: "Qual é a contração de \"you are\"?", options: ["you're", "your", "you's"], answer: "you're", explain: "you are = you're. Cuidado: \"your\" significa \"seu/sua\"." },
    { type: "listen", audio: "six", options: ["six", "seven", "sixteen"], answer: "six", explain: "six = 6." },
    { type: "build", pt: "Ele é meu amigo.", answer: "He is my friend", extra: ["are", "her"], explain: "he + is. \"my friend\" = meu amigo." },
  ] },
  { title: "Soletrar e telefone", activities: [
    { type: "fill", context: "A: How do you spell your last name?", before: "B:", after: "", options: ["L-I-M-A.", "Lima, too.", "Ten."], answer: "L-I-M-A.", explain: "\"Spell\" = soletrar. Dizemos letra por letra." },
    { type: "match", pairs: [["last name", "sobrenome"], ["phone number", "número de telefone"], ["his", "dele"], ["her", "dela"]], explain: "Vocabulário de dados pessoais." },
    { type: "fill", before: "This is Leo.", after: "name is Leo.", options: ["His", "Her", "My"], answer: "His", explain: "Para um homem usamos \"his\" (dele)." },
    { type: "fill", before: "This is Ana.", after: "last name is Costa.", options: ["Her", "His", "Your"], answer: "Her", explain: "Para uma mulher usamos \"her\" (dela)." },
    { type: "choose", line: "What's your phone number?", options: ["It's 555-0192.", "It's L-I-M-A.", "I'm fine."], answer: "It's 555-0192.", explain: "Perguntou o número de telefone, respondemos com números." },
    { type: "listen", audio: "What's your last name?", options: ["What's your last name?", "What's your phone number?", "What's his name?"], answer: "What's your last name?", explain: "\"last name\" = sobrenome." },
    { type: "write", prompt: "9", answer: ["nine"], explain: "9 = nine." },
    { type: "build", pt: "Qual é o seu número de telefone?", answer: "What's your phone number", extra: ["my", "name"], explain: "\"your\" = seu/sua." },
  ] },
];

export const unit2: Lesson[] = [
  { title: "Objetos do dia a dia", activities: [
    { type: "match", pairs: [["keys", "chaves"], ["wallet", "carteira"], ["umbrella", "guarda-chuva"], ["phone", "celular"]], explain: "Objetos pessoais." },
    { type: "fill", before: "It's", after: "umbrella.", options: ["an", "a", "the"], answer: "an", explain: "Use \"an\" antes de som de vogal: an umbrella." },
    { type: "fill", before: "It's", after: "wallet.", options: ["a", "an", "these"], answer: "a", explain: "Use \"a\" antes de som de consoante: a wallet." },
    { type: "listen", audio: "notebook", options: ["notebook", "phone", "desk"], answer: "notebook", explain: "notebook = caderno." },
    { type: "choose", line: "What's this?", options: ["It's a bag.", "They're bags.", "It's an bag."], answer: "It's a bag.", explain: "\"This\" é singular → \"It's a...\"." },
    { type: "match", pairs: [["desk", "mesa"], ["bag", "bolsa"], ["chair", "cadeira"], ["notebook", "caderno"]], explain: "Mais objetos." },
    { type: "build", pt: "Isto é um celular.", answer: "This is a phone", extra: ["these", "an"], explain: "\"This is a...\" = \"Isto é um(a)...\"." },
    { type: "write", prompt: "keys (em português)", answer: ["chaves"], explain: "keys = chaves." },
  ] },
  { title: "Plurais: this / these", activities: [
    { type: "fill", before: "What are", after: "?", options: ["these", "this", "it"], answer: "these", explain: "\"These\" é o plural de \"this\"." },
    { type: "choose", line: "What are these?", options: ["They're keys.", "It's a key.", "It's keys."], answer: "They're keys.", explain: "Plural → \"They're...\"." },
    { type: "write", prompt: "Plural de \"chair\"", answer: ["chairs"], explain: "A maioria dos plurais ganha -s: chairs." },
    { type: "write", prompt: "Plural de \"wallet\"", answer: ["wallets"], explain: "wallet → wallets." },
    { type: "listen", audio: "They're umbrellas.", options: ["They're umbrellas.", "It's an umbrella.", "These are wallets."], answer: "They're umbrellas.", explain: "\"They're\" = eles/elas são." },
    { type: "build", pt: "Estes são meus cadernos.", answer: "These are my notebooks", extra: ["this", "is"], explain: "these + are + plural." },
    { type: "fill", before: "Is", after: "your bag? Yes, it is.", options: ["this", "these", "they"], answer: "this", explain: "\"bag\" é singular → \"this\"." },
    { type: "match", pairs: [["this", "isto/este"], ["these", "estes"], ["it", "ele/ela (coisa)"], ["they", "eles/elas"]], explain: "Singular x plural." },
  ] },
  { title: "Onde está?", activities: [
    { type: "match", pairs: [["in", "dentro de"], ["on", "em cima de"], ["under", "embaixo de"], ["behind", "atrás de"]], explain: "Preposições de lugar." },
    { type: "fill", context: "A: Excuse me. Where are my keys?", before: "B: They're", after: "the desk.", options: ["on", "in", "under"], answer: "on", explain: "\"on\" = em cima de (em contato com a superfície)." },
    { type: "fill", before: "Where", after: "my umbrella?", options: ["is", "are", "am"], answer: "is", explain: "umbrella é singular → \"Where is...?\"." },
    { type: "choose", line: "Where is my umbrella?", options: ["It's behind the chair.", "They're behind the chair.", "It's a chair."], answer: "It's behind the chair.", explain: "Singular → \"It's...\"; behind = atrás de." },
    { type: "listen", audio: "It's next to your phone.", options: ["It's next to your phone.", "It's in front of your phone.", "It's under your phone."], answer: "It's next to your phone.", explain: "\"next to\" = ao lado de." },
    { type: "match", pairs: [["next to", "ao lado de"], ["in front of", "na frente de"], ["the", "o/a"], ["where", "onde"]], explain: "Mais preposições." },
    { type: "build", pt: "A carteira está embaixo da cadeira.", answer: "The wallet is under the chair", extra: ["on", "are"], explain: "under = embaixo de." },
    { type: "build", pt: "Onde estão minhas chaves?", answer: "Where are my keys", extra: ["is", "your"], explain: "keys é plural → \"Where are...?\"." },
  ] },
];
