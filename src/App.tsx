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
}

const InputContext = createContext<InputContextData>({} as InputContextData) 

export const Input: React.FC<InputProps> = ({name, setChangeElement, deleteWithDoubleClick = false,...rest}) => {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  const {values, setValues} = useContext(InputContext)
  const [isSecondClick, setSecondClick] = useState(false)

  useEffect(()=> {
    ref.current?.focus();
  }, [])

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
     

      
    </Container>
  )
}


const App: React.FC = () => {
  const [elements, setElements] = useState<React.FunctionComponentElement<InputProps>[]>([])
  const [count, setCount] = useState(0)
  const [values, setValues] = useState<Data>({})
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
    setPrintValues(JSON.stringify(values))
  }

  return (
    <div> 
      Hello<br/>
      <InputContext.Provider value={{values, setValues}}>
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
          Adicionar validações e mensagens de erro
        </li>
        <li>
          Adicionar uma estilização para apresentação
        </li>

      </ul>
    </div>
  );
}

export default App;
