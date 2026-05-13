const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('primary','english','Which part of speech is the word "quickly"?',['Noun','Verb','Adjective','Adverb'],'Adverb','CTET 2019',2019),
Q('primary','english','The plural of "child" is-',['childs','children','childrens','child'],'children','CTET 2019',2019),
Q('primary','english','Which is a correct sentence?',['He go to school','He goes to school','He going to school','He gone to school'],'He goes to school','UPTET 2019',2019),
Q('primary','english','Language acquisition occurs-',['Through formal teaching','Naturally through exposure','Only in school','Through grammar drills'],'Naturally through exposure','CTET 2020',2020),
Q('primary','english','Reading comprehension means-',['Reading aloud','Understanding the text','Memorizing the text','Copying the text'],'Understanding the text','UPTET 2020',2020),
Q('primary','english','The passive voice of "She writes a letter" is-',['A letter is written by her','A letter was written by her','A letter written by her','A letter is write by her'],'A letter is written by her','CTET 2021',2021),
Q('primary','english','Phonemic awareness refers to-',['Knowing the alphabet','Understanding sounds in spoken words','Reading fluency','Writing skills'],'Understanding sounds in spoken words','UPTET 2021',2021),
Q('primary','english','A synonym of "happy" is-',['Sad','Angry','Joyful','Tired'],'Joyful','CTET 2018',2018),
Q('primary','english','An antonym of "brave" is-',['Bold','Cowardly','Strong','Fearless'],'Cowardly','UPTET 2018',2018),
Q('primary','english','The correct article to use before "university" is-',['A','An','The','No article'],'A','CTET 2022',2022),
Q('primary','english','Whole language approach emphasizes-',['Grammar rules','Holistic learning of language','Phonics only','Translation method'],'Holistic learning of language','CTET 2023',2023),
Q('primary','english','Which is a preposition?',['Run','Beautiful','Under','Quickly'],'Under','UPTET 2022',2022),
Q('primary','english','Formative assessment in language learning helps to-',['Give final grades','Improve learning process','Rank students','Punish students'],'Improve learning process','CTET 2017',2017),
Q('primary','english','Storytelling in language class helps in-',['Only entertainment','Developing listening and imagination','Discipline','Time pass'],'Developing listening and imagination','UPTET 2017',2017),
Q('primary','english','The correct past tense of "go" is-',['Goed','Gone','Went','Going'],'Went','CTET 2016',2016),
Q('junior','english','A figure of speech that compares two unlike things using "like" or "as" is-',['Metaphor','Simile','Personification','Hyperbole'],'Simile','CTET 2019',2019),
Q('junior','english','Which is an example of a compound sentence?',['He ran fast','He ran fast and he won the race','Running fast','The fast runner'],'He ran fast and he won the race','UPTET 2019',2019),
Q('junior','english','Process writing approach includes-',['Only final draft','Drafting, revising, editing','Copying from textbook','Memorizing essays'],'Drafting, revising, editing','CTET 2020',2020),
Q('junior','english','Communicative Language Teaching focuses on-',['Grammar rules','Meaning and communication','Translation','Memorization'],'Meaning and communication','UPTET 2020',2020),
Q('junior','english','Which tense is used in: "I have been reading"?',['Simple Present','Present Perfect Continuous','Past Perfect','Future Perfect'],'Present Perfect Continuous','CTET 2021',2021),
];
