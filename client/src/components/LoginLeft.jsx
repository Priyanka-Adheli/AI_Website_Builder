import React from 'react'

const LoginLeft = () => {
  return (
    <div className="hidden lg:flex lg:w-2/5 bg-[url('/bg-img.png')] bg-cover
    bg-center bg-no-repeat flex-col justify-between p-12 shrink-0 select-none">

        <div>
            <img src="/logo.svg" alt="Logo" className='size-9.5'/>
            <span className='text-4xl font-medium text-white'>Builder AI</span>
        </div>
        <div>
            <h2 className='text-3xl text-white font-medium leading-snug mb-3 tracking-tight'>Build your presence on web</h2>
            <p className='text-zinc-300'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus accusamus tenetur quisquam beatae. Ratione, necessitatibus doloribus esse optio unde cupiditate natus vel quos dolor dolorum voluptate autem cum. Illo, facilis?
                Magnam, quasi? Velit quae blanditiis dolorum deleniti facere sunt dignissimos veniam sit, quo impedit a modi repellendus commodi magni quasi molestiae quos! Quam minus nihil aut dolores magnam quis odio!
                Dolore repellendus quod velit ipsam dolorum libero voluptatibus maiores, accusamus nihil aliquid sequi vel. Nemo eveniet molestiae sed nesciunt. Voluptas laudantium quam expedita, cupiditate tempore excepturi vel optio quod eius.
            </p>
            <p className='text-zinc-300 text-sm mt-12'>Copyright {new Date().getFullYear()}</p>
        </div>
    </div>
  )
}

export default LoginLeft