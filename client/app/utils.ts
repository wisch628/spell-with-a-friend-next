// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callPostRoute = async (route: string, body: any) => {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_URL}/${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((response) => response.json())
      return response;
}


export const captialize = (word: string) => {
    return String(word).charAt(0).toUpperCase() + String(word).slice(1);

}
