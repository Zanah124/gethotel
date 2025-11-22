import React from 'react'


const Accueil = () => {
  return (
    <div className='flex flex-col items-start justify-center px-6 md:px-16 
    lg:px-24 xl:px-32 text-white bg-[url("/src/assets/acc.png")] bg-no-repeat bg-cover bg-center h-screen brightness-80'>

    <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>Les Ultime hotel Experience</p>
    <h1 className='font-pt-serif text-2xl md:text-5xl md:text-[56px] md:leading-[56px]
    font-bold md:font-extrabold max-w-xl mt-4'>Réservez votre hôtel dans une destination de rêve</h1>
    <p className='max-w-130 mt-2 text-sm md:text-base'>Votre prochaine aventure commence ici : trouvez l’hôtel parfait pour vivre chaque voyage 
      comme une histoire à raconter. Où que vous alliez, choisissez un lieu où le repos rencontre l’inspiration.</p>
    </div>
  )
}

export default Accueil