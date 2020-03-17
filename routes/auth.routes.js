const {Router} = require('express')
const bcrypt = require('bcriptjs')
const {check, validashionResult} = require('express-validator')
const User = require('..models/User')
const router = Router()

// /api/auth
router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символа')
            .isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validashionResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).JSON({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                })
            }
            const {email, password} = req.body
            const candidate = await user.findOne({email})
            if (candidate) {
                return res.status(400).json({message: 'Такой пользователь уже существует'})
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({email, password: hashedPassword})
            await user.save()
            res.status(201).json({message: 'Пользователь создан'})


        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера, попробуйте еще'})
        }

    })

// /api/auth
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validashionResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).JSON({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в системе'
                })
            }
            const {email, password} = req.body
            const user = await user.findOne({email})
            if (!user) {
                return res.status(400).json({message: 'Такой пользователь не существует'})
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({message: 'Неверный пароль'})
            }

            res.status(201).json({message: 'Пользователь создан'})


        } catch (e) {
            res.status(500).json({message: 'Ошибка сервера, попробуйте еще'})
        }
    }
)

module.exports = router