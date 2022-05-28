https://nextjs.org/learn/foundations/from-react-to-nextjs/getting-started-with-nextjs
https://nextjs.org/learn/basics/create-nextjs-app/setup

https://ru.reactjs.org/docs/introducing-jsx.html
https://ru.reactjs.org/docs/add-react-to-a-website.html
https://docs.google.com/spreadsheets/d/1LlnfCoqkow7yAmee4IkqiGos9H7RWYQs9332sFh_rpk/edit#gid=983198096

https://docs.google.com/spreadsheets/d/1LlnfCoqkow7yAmee4IkqiGos9H7RWYQs9332sFh_rpk/edit#gid=165754394

Запуск
npm run dev

Open: http://localhost:3000/
https://ru.reactjs.org/docs/context.html

Переход на typescript:
https://nextjs.org/docs/basic-features/typescript#pages
https://ru.reactjs.org/docs/static-type-checking.html#configuring-the-typescript-compiler

DB:
https://dev-gang.ru/article/naczalo-raboty-s-postgres-v-vashem-prilozhenii-react-olh4g437dj/
https://docs.sequelizejs.com/docs/v7/getting-started/
https://qna.habr.com/q/418785
https://webformyself.com/top-5-vstroennyx-baz-dannyx-dlya-prilozhenij-javascript/

**************************************************************************************

1. + Где хранить данные (база данных)
2. Процес игры, раунды торгов, как это должно работать?
    установить D на занятое место
3. Обьект игрока
4. Правила

колода, раздача карт

Вычисление комбинации:
Посчитать все возможные комбинации из 7 карт за ранее
сохранить по уникальному ключу из 7 названий карт
ключ это сортированные названи карт

Или по каждой комбинации найти все возможные варианты
5 карт это меньше комбинаций чем 7 карт
------------------------------------------------------------------------------------------
 let count = 52;
let start = 7;
let res = 1;
for (let i=7;i<count;i++){
    res= res+start;
    start=  start + i;
    
    console.log(start,res);// 21436
}
 
 