import React, { useState, useEffect, InputHTMLAttributes, useRef, useContext, createContext} from 'react';

import {Container} from './styles'


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  setChangeElement(namekey: string): void;
  deleteWithDoubleClick?: boolean
}

interface Data {
  [index: string]: number | string;
}

interface InputContextData {
  values: object;
  setValues(object: Data): void;
  errors: object;
  setErrors(object: Data): void;
}

const InputContext = createContext<InputContextData>({} as InputContextData) 

export const Input: React.FC<InputProps> = ({name, setChangeElement, deleteWithDoubleClick = false,...rest}) => {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  const {values, setValues, errors} = useContext(InputContext)
  const [isSecondClick, setSecondClick] = useState(false)


  useEffect(()=> {
    ref.current?.focus();
  }, [])

  useEffect(()=> {
    setValues({...values, [name]: ''})
  }, [name, setValues])

  useEffect(()=> {
    let cancel = false;
    function timeOut() {
      if(isSecondClick){
        setTimeout(()=> {
          if(cancel) return
          setSecondClick(false)      
        }, 5000)
      }
    }
   timeOut()
   return () => {cancel = true;};

  }, [isSecondClick])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    setValues({...values, [name]: event.target.value})
  
  }

  const handleDelete = () => {
    setChangeElement(name)
    setSecondClick(false)
  }

  const handleSecondClick = () => {
    setSecondClick(true)
  }

  const setError = () => {
    const err = Object.entries(errors).filter(error=> {
     return error[0] === name
    })
    if(!err.length){
      return ''
    }
    return err[0][1]
  }

  return (
    <Container>
      <input {...rest} onChange={handleChange} value={value} ref={ref}/>
      {!deleteWithDoubleClick ? (
        <button type='button' onClick={handleDelete}>Delete</button>
      ) : (
        <>
          {!isSecondClick ? (
            <button type='button' onClick={handleSecondClick}>Delete</button>
          ): (
            <button type='button' onClick={handleDelete}>Click Again</button>
          )}
        </>
      )}
      <br/>
      <span>{setError()}</span>
     

      
    </Container>
  )
}


const App: React.FC = () => {
  const [elements, setElements] = useState<React.FunctionComponentElement<InputProps>[]>([])
  const [count, setCount] = useState(0)
  const [values, setValues] = useState<Data>({})
  const [errors, setErrors] = useState<Data>({})
  const [changeElement, setChangeElement] = useState('')
  const [printValues, setPrintValues] = useState('')


  useEffect(()=> {
   const key = changeElement.split('-')[1]
   setElements(prevState => prevState.filter((element) => element.key !== key))
   delete values[changeElement]

  }, [changeElement, values])

  const createInput = () => {
   
    const element = React.createElement(Input, {key: count, name: `input-${count}`, setChangeElement: setChangeElement, deleteWithDoubleClick: true}, null)

    setCount(count + 1)
    setElements([...elements, element])
   
  }

  const print = () => {
    const val = Object.entries(values).map(v => {
      if(v[1] === ''){
        return v[0]
      }
      return undefined
    })
    const e = {} as Data
    val.map(err => {
      if(err){
        e[err] = 'Campo obrigatório'
      }
      return undefined
    })
    console.log(e)
    if(Object.keys(e).length){
      setErrors(e)
      setPrintValues('')
      return
    }
    setErrors({})
    setPrintValues(JSON.stringify(values))
  }

  return (
    <div> 
      Hello<br/>
      <InputContext.Provider value={{values, setValues, errors, setErrors}}>
      {elements}
      </InputContext.Provider>
      <input type='text'onFocus={createInput}/>
     

      <br/><br/>
      
      <button type='button' onClick={print}>Enviar</button>
      <br/>
      {printValues}

      <br/><br/>
      <h2> Próximas tarefas</h2>
      <ul>
      <li>
         <s> Resolver a dependencia do effect</s>
        </li>
        <li>
          <s>Trocar Focus quando clicar no input principal</s>
        </li>
        <li>
          <s>Resolver o problema dos valores ao enviar</s>
        </li>
        <li>
        <s> Remover com duplo clique</s>
        </li>
        <li>
        <s> Adicionar validações e mensagens de erro</s>
        </li>
        <li>
          Componentizar
        </li>
        <li>
          Adicionar uma estilização para apresentação
        </li>

      </ul>
    </div>
  );
}

export default App;
