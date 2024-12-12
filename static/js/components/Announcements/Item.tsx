import { Close } from '@rimble/icons'
import { Markup } from 'interweave'
import { Button } from 'rimble-ui'
import styled, { createGlobalStyle } from 'styled-components/macro'

const QuillEditorStyles = createGlobalStyle`
  /* On the admin UI we use "Quill editor" for configuring the text sizes and here we map each of the clases to a font size */
  .ql-size-small {
    font-size: 0.75em;
  }
  .ql-size-large {
    font-size: 1.5em;
  }
  .ql-size-huge {
    font-size: 2.5em;
  }
`

interface ContentBoxProps {
  backgroundColor: string
}

const ContentBox = styled.div<ContentBoxProps>`
  position: relative;

  width: 100%;
  height: ${({ theme }) => theme.layout.announcements.heightPixels}px;

  padding-right: 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ backgroundColor }) => backgroundColor};

  a {
    color: inherit;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.[0]}) {
    height: ${({ theme }) => theme.layout.announcements.mobileHeightPixels}px;
  }
`

const StyledButton = styled(Button)`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);

  width: 24px;
  min-width: 0;
  height: 24px;

  padding: 0;
`

export interface IAnnouncementItemProps {
  label: string
  backgroundColor: string
  onClose: () => void
}

const AnnouncementItem = ({
  label,
  backgroundColor,
  onClose,
}: IAnnouncementItemProps) => {
  return (
    <>
      <QuillEditorStyles />
      <ContentBox backgroundColor={backgroundColor}>
        <Markup content={label} />
        <StyledButton onClick={onClose}>
          <Close />
        </StyledButton>
      </ContentBox>
    </>
  )
}

export default AnnouncementItem
