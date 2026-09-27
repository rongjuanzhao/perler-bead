interface CalculationData {
  id: string
  initial: number
  final: number
  percentage: number
  timestamp: Date
}

export const exportToCSV = (data: CalculationData[], filename: string = 'percentage-calculations') => {
  const csvContent = [
    ['Initial Value', 'Final Value', 'Percentage Change', 'Timestamp'].join(','),
    ...data.map(item => [
      item.initial,
      item.final,
      item.percentage.toFixed(2) + '%',
      item.timestamp.toISOString()
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const shareCalculation = async (data: CalculationData) => {
  const shareText = `Percentage Increase: ${data.initial} → ${data.final} = ${data.percentage >= 0 ? '+' : ''}${data.percentage.toFixed(2)}%`
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Percentage Calculator Result',
        text: shareText,
        url: window.location.href
      })
    } catch (error) {
      copyToClipboard(shareText)
    }
  } else {
    copyToClipboard(shareText)
  }
}

export const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

export const saveToLocalStorage = (data: CalculationData[]) => {
  try {
    localStorage.setItem('percentage-calculations', JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export const loadFromLocalStorage = (): CalculationData[] => {
  try {
    const saved = localStorage.getItem('percentage-calculations')
    if (saved) {
      const data = JSON.parse(saved)
      return data.map((item: any) => ({
        ...item,
        id: item.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(item.timestamp)
      }))
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
  }
  return []
}