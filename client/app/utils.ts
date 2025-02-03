export const callPostRoute = async (route: string, body: any) => {
        const response = await fetch(`http://localhost:8000/${route}`, {
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
