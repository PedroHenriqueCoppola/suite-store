class Globals {
    static validateInputSpacesAndCapitalize(inputName) {
        const normalName = inputName
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/^\s+|\s+$/g, "")
            .replace(/\s+/g, " ");
    
        // russo function 
        // str: string que vai ser modificada
        // lower: se todas as outras letras vão estar lowercased
        const capitalize = (str, lower = false) => (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());;
        return capitalize(normalName, true); // retorna o replace e o segundo param como true
    }
    
    static limitTextInput(inputValue) {
        const textRegex = /^[a-zA-Z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/;
    
        return textRegex.test(inputValue)
    }
}

export default Globals;