export async function sendFrameToBackend(blob: Blob): Promise<any> {
  const formData = new FormData();
  formData.append('file', blob, 'frame.jpg');
  const response = await fetch('/api/v1/pose', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Backend error');
  return response.json();
}
