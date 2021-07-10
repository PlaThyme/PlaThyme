import React from 'react'; 

const RandomWord = () => {
    const [displayedWord, setWord] = React.useState(0);
    const filename = './hard.txt';
    let ret = 'null';
    let reader = new FileReader(); 
    
    reader.onload = (res) => { 
    const file = res.target.result; 
    console.log(file);
    const lines = file.split(/\r\n|\n/);
    console.log(reader.result)
    console.log(reader.readAsText(filename))
    ret = lines.join('\n');
    }
    console.log(filename)
    console.log(reader.result)

    //let ChallengingWords = reader.readAsText(filename)


    //let randint = Math.floor(Math.random() * ChallengingWords.length + 1)
    //let ret = ChallengingWords[randint]
    //ChallengingWords.remove(ret)
    return (
    <div>
        {ret}
    </div>
    )
}
export default RandomWord;