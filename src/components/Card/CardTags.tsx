import styled from 'styled-components'
import React from 'react'

const CardTagsContainer = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  flex-direction: column;
  img.icon[alt='icon'] {
    width: 30px;
    height: 30px;
    background: rgba(0, 0, 0, 0.33);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    border-radius: 100%;
    margin-bottom: 10px;
  }
`

export const CardTags: React.FC<{
  icons: string[]
}> = ({ icons }) => {
  return (
    <CardTagsContainer>
      {icons.map((icon, i) => (
        <img className="icon" key={i} src={icon} alt="icon" />
      ))}
    </CardTagsContainer>
  )
}
