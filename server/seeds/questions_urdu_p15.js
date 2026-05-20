const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('primary','urdu','حروف قمری کتنے ہیں؟',['14','15','12','16'],'14','UPTET Practice',2026),
Q('primary','urdu','لفظ "سستا" کا متضاد کیا ہے؟',['مہنگا','قیمتی','خالص','نیا'],'مہنگا','CTET Practice',2026),
Q('primary','urdu','اردو کا سب سے پہلا ڈراما کون سا ہے؟',['اندر سبھا','انارکلی','یہودی کی لڑکی','رستم و سہراب'],'اندر سبھا','UPTET Practice',2026),
Q('primary','urdu','اردو قواعد میں حروف جار کیا کہلاتے ہیں؟',['Prepositions','Conjunctions','Interjections','Verbs'],'Prepositions','CTET Practice',2026),
Q('primary','urdu','لفظ "شمس" کا ہم معنی لفظ کیا ہے؟',['سورج','چاند','ستارہ','آسمان'],'سورج','UPTET Practice',2026),
Q('junior','urdu','خدا سخن کس شاعر کو کہا جاتا ہے؟',['میر تقی میر','غالب','سودا','درد'],'میر تقی میر','CTET Practice',2026),
Q('junior','urdu','اردو میں عوامی شاعر کسے کہا جاتا ہے؟',['نظیر اکبر آبادی','حالی','اقبال','اکبر الٰہ آبادی'],'نظیر اکبر آبادی','UPTET Practice',2026),
Q('junior','urdu','اردو کی پہلی داستان کون سی ہے؟',['سب رس','باغ و بہار','فسانہ عجائب','بوستان خیال'],'سب رس','CTET Practice',2026),
Q('junior','urdu','جس نظم में صحابہ کرام یا اولیاء کرام کی تعریف کی جائے، اسے کیا کہتے ہیں؟',['منقبت','نعت','حمد','قصیدہ'],'منقبت','UPTET Practice',2026),
Q('junior','urdu','بادشاہوں یا امیروں کی تعریف میں لکھی جانے والی نظم کو کیا کہتے ہیں؟',['قصیدہ','حمد','نعت','مرثیہ'],'قصیدہ','CTET Practice',2026),
];
