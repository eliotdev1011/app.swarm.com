import { LinearProgress } from '@material-ui/core'
import { DriveFolderUpload } from '@styled-icons/material/DriveFolderUpload'
import { InsertDriveFile } from '@styled-icons/material/InsertDriveFile'
import { TaskAlt } from '@styled-icons/material/TaskAlt'
import React, { useState } from 'react'
import {
  DropzoneOptions,
  FileError,
  FileRejection,
  useDropzone,
} from 'react-dropzone'
import { Box, Button, Flex, Text } from 'rimble-ui'
import styled from 'styled-components/macro'

type ErrorReturn = FileError[] | null

interface Props {
  dropzoneOptions?: DropzoneOptions & {
    asyncValidator?: <T extends File>(
      file: T,
    ) => ErrorReturn | Promise<ErrorReturn>
  }
  error?: string
  uploadText?: string
  successText?: string
  loading?: boolean
  loadingText?: string
}

const DropzoneStyled = styled(Flex)<{
  $isDragActive: boolean
  $isError: boolean
  $isSuccess: boolean
}>(({ theme, $isDragActive, $isError, $isSuccess }) => {
  const errorStyles = $isError
    ? {
        borderColor: theme.colors.danger,
        backgroundColor: theme.colors['danger-light'],
      }
    : {}

  return {
    width: '100%',
    height: 146,
    cursor: 'pointer',
    border: $isSuccess ? 'none' : '2px dashed',
    borderColor: theme.palette.primary.main,
    borderRadius: 8,
    backgroundColor: 'rgba(1, 121, 239, 0.1)',
    marginTop: 2,
    transform: $isDragActive ? 'scale(0.98)' : 'scale(1)',
    ...errorStyles,
  }
})

const UploadButton = styled(Button)({
  height: 44,
  fontWeight: 700,
})

const UploadIcon = styled(DriveFolderUpload)(({ theme }) => {
  return {
    color: theme.colors.primary,
  }
})

const SuccessText = styled(Text.p)(({ theme }) => {
  return {
    marginTop: 22,
    color: theme.colors.success,
    fontWeight: 700,
  }
})

const SuccessIcon = styled(TaskAlt)(({ theme }) => {
  return {
    color: theme.colors.success,
  }
})

const Loader = styled(LinearProgress)(({ theme }) => {
  return {
    width: '100%',
    borderRadius: 5,
    color: theme.colors.primary,
  }
})

const FileInfoText = styled(Text.p)(() => {
  return {
    maxWidth: '100%',
    padding: '0 20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
})

const InsertDriveFileIcon = styled(InsertDriveFile)(({ theme }) => {
  return {
    color: theme.colors.primary,
  }
})

const AcceptedFile: React.FC<{ file: File }> = ({ file }) => {
  const fileInfo = file.name

  return (
    <>
      <InsertDriveFileIcon size={50} />
      <FileInfoText variant="subtitle1">{fileInfo}</FileInfoText>
    </>
  )
}

const DropzoneField: React.FC<Props> = (props) => {
  const [rejection, setRejection] = useState<FileRejection | null>(null)
  const {
    dropzoneOptions,
    uploadText = 'Drag & Drop to upload file or choose a file',
    successText = 'Successfully uploaded',
    error,
    loading,
    loadingText,
  } = props

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    ...dropzoneOptions,
    maxFiles: 1,
    async onDropAccepted(files, event) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const file = files[0]!
      setRejection(null)
      const errors = await dropzoneOptions?.asyncValidator?.(file)
      if (errors) {
        setRejection({
          file,
          errors,
        })
      } else {
        dropzoneOptions?.onDropAccepted?.(files, event)
      }
    },
    onFileDialogOpen() {
      if (dropzoneOptions?.onFileDialogOpen) {
        setRejection(null)
        dropzoneOptions.onFileDialogOpen()
      }
    },
    onFileDialogCancel() {
      if (dropzoneOptions?.onFileDialogCancel) {
        setRejection(null)
        dropzoneOptions.onFileDialogCancel()
      }
    },
  })

  const file = acceptedFiles[0]
  const externalError = error
    ? [{ message: error, code: 'external-error' }]
    : undefined
  const errors = fileRejections[0]?.errors || rejection?.errors || externalError
  const isError = Boolean(errors)
  const isDropAccepted = Boolean(file && !isError)
  const isSuccess = Boolean(isDropAccepted)

  if (loading) {
    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} id="dropzone" />
        <DropzoneStyled
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          $isDragActive={isDragActive}
          $isError={false}
          $isSuccess={false}
        >
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
            px={3}
          >
            <Box width="100%">
              <Loader />
            </Box>
            {loadingText ? (
              <Text sx={{ mt: 2 }} color="primary">
                {loadingText}
              </Text>
            ) : null}
          </Flex>
        </DropzoneStyled>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} id="dropzone" />
        <DropzoneStyled
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          $isDragActive={isDragActive}
          $isError={false}
          $isSuccess
        >
          {isDropAccepted ? (
            <>
              <SuccessIcon size={50} />
              <SuccessText fontSize={1}>{successText}</SuccessText>
            </>
          ) : null}
        </DropzoneStyled>
      </div>
    )
  }

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} id="dropzone" />
      <DropzoneStyled
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        $isDragActive={isDragActive}
        $isError={isError}
        $isSuccess={isSuccess}
      >
        {file && !isDropAccepted ? <AcceptedFile file={file} /> : null}

        {!file && isDragActive ? <UploadIcon size={50} /> : null}

        {!file && !isDragActive ? (
          <UploadButton type="button" variant="contained">
            {uploadText}
          </UploadButton>
        ) : null}
      </DropzoneStyled>

      {isError ? (
        <Text.p color="danger" mt={1}>
          {errors[0]?.message}
        </Text.p>
      ) : null}
    </div>
  )
}

export default DropzoneField
