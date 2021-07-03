//Source of code: https://github.com/WebDevSimplified/Whatsapp-Clone

import {useEffect, useState} from 'react'

const APP_NAME  = 'plathyme'

export default function useLocalStorage (key, initialValue) {
    const storageKey = APP_NAME + key;
    const [val, setVal] = useState(() => {
        const jsonValue = localStorage.getItem(storageKey)
        if (jsonValue != null) return JSON.parse(jsonValue)
        if(typeof initialValue === 'function'){
            return initialValue()
        } else {
            return initialValue
        }
    })
    useEffect(() => {localStorage.setItem(storageKey, JSON.stringify(value))}, [storageKey, value])

    return [value, setValue]
}